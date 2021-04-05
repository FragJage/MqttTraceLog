import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-log-level-manager',
  templateUrl: './log-level-manager.component.html',
  styleUrls: ['./log-level-manager.component.scss']
})

export class LogLevelManagerComponent implements OnInit, OnDestroy {
  public sourcesList : string[] = new Array();
  public levelsList : string[];
  public levelBySrc: { [source: string]: string; } = {};
  private lvlSubscription : Subscription;

  constructor(private logService : LogService) { }

  ngOnInit(): void {
    let lvlBySrc = this.logService.GetSourcesWithLevel();
    Object.keys(lvlBySrc).forEach(key => 
    {
      this.sourcesList.push(key);
      this.levelBySrc[key] = lvlBySrc[key];
    });
    this.lvlSubscription = this.logService.GetLevels().subscribe(lvl => this.levelsList = lvl);
  }

  ngOnDestroy(): void {
    if(this.lvlSubscription) this.lvlSubscription.unsubscribe();
  }

  public SetLogLevel(topic: string)
  {
    let level = this.levelBySrc[topic];
    this.logService.SendLoglevel(topic, level);
  }
}
