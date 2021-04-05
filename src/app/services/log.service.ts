import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService, IMqttServiceOptions } from "ngx-mqtt";
import { Subject, timer } from 'rxjs';
import { LogModel } from '../log.model';

@Injectable({
  providedIn: 'root'
})

export class LogService {
  public Log = new Subject<LogModel>();
  public Sources = new Subject<string[]>();
  public Levels = new Subject<string[]>();
  private mqttService : MqttService;
  private logs : LogModel[] = [];
  private sourcesList : string[] = ["owfs", "mysql", "teleinfo", "energeasy"];
  private levelsList : string[] = ["trace", "debug", "verbose", "warning", "error", "fatal"];
  private levelBySrc: { [source: string]: string; } = { };

  constructor() {
    const maxlvl = this.levelsList.length-1;
    this.sourcesList.forEach(src => {
      this.levelBySrc[src] = this.levelsList[maxlvl];
    });
    let options: IMqttServiceOptions = {
      hostname: "192.168.0.5",
      port: 1884,
      protocol: 'ws',
      path: ''
    };
    this.mqttService = new MqttService(options);
    this.mqttService.observe("logger/#").subscribe((data: IMqttMessage) => { 
      let event = data.payload.toString();
      let split = event.split(' ', 6);
      if(split.length != 6) return;
      let log = new LogModel();
      log.topic = data.topic.split('/')[1];
      log.date = new Date(split[0]+'T'+split[1]);
      log.level = split[2];
      log.file = split[3];
      log.line = +split[4].substring(2);
      log.method = split[5];
      log.event = event.substring(split[0].length+split[1].length+split[2].length+split[3].length+split[4].length+split[5].length+6).slice(0, -1);
      var pos = log.file.lastIndexOf('/');
      if(pos!=-1) log.file = log.file.substring(pos+1);
      
      this.UpdateSources(log.topic);
      this.UpdateLevels(log.level);
      this.UpdateLvlBySrc(log.topic, log.level);

      this.logs.push(log);
      if(this.logs.length > 1000) this.logs.shift();
      this.Log.next(log);
    });
  }

  private UpdateSources(source: string)
  {
    let str = source.toLowerCase();
    if(this.sourcesList.indexOf(str) === -1)
    {
      this.sourcesList.push(str);
      this.Sources.next(this.sourcesList);
    }
  }

  private UpdateLevels(level: string)
  {
    let str = level.toLowerCase();
    if(this.levelsList.indexOf(str) === -1)
    {
      this.levelsList.push(str);
      this.Levels.next(this.levelsList);
    }
  }

  private UpdateLvlBySrc(source: string, level: string)
  {
    let lvl = level.toLowerCase();
    let newLvl = this.levelsList.indexOf(lvl);
    let act = this.levelBySrc[source];
    let actual = (act==undefined) ? this.levelsList.length-1 : this.levelsList.indexOf(act);
    if(newLvl<=actual) this.levelBySrc[source] = lvl;
  }

  public GetLogs()
  {
    return this.Log.asObservable();
  }

  public GetCachedLogs()
  {
    return this.logs;
  }

  public GetSources()
  {
    const delay = timer(250);
    const subscribe = delay.subscribe(x => {
      this.Sources.next(this.sourcesList);
      subscribe.unsubscribe();
    });
    return this.Sources.asObservable();
  }

  public GetLevels()
  {
    const delay = timer(250);
    const subscribe = delay.subscribe(x => {
      this.Levels.next(this.levelsList);
      subscribe.unsubscribe();
    });
    return this.Levels.asObservable();
  }

  public GetSourcesWithLevel()
  {
    return this.levelBySrc;
  }

  public SendLoglevel(topic: string, level: string)
  {
    console.log("logger/"+topic+"/command/LOGLEVEL => "+level.toUpperCase());
    this.mqttService.unsafePublish("logger/"+topic+"/command/LOGLEVEL", level.toUpperCase());
  }
}
