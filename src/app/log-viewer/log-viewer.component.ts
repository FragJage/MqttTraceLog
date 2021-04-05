import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LogService } from '../services/log.service';
import { LogModel } from '../log.model';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss']
})
export class LogViewerComponent implements OnInit, OnDestroy {
  public logs: LogModel[];
  public logsFiltered: LogModel[] = [];
  public sourcesList: string[];
  public sourcesFilter: string[] = [];
  public levelsList: string[];
  public levelsFilter: string[] = [];
  public keyword: string = "";
  private logSubscription : Subscription;
  private srcSubscription : Subscription;
  private lvlSubscription : Subscription;

  constructor(private logService : LogService) 
  { 
  }

  ngOnInit()
  {
    this.logs = this.logService.GetCachedLogs();
    this.updateLogFiltered();
    this.logSubscription = this.logService.GetLogs().subscribe(log => {
      //this.logs.push(log);
      this.updateLogFiltered();
    });
    this.srcSubscription = this.logService.GetSources().subscribe(src => this.sourcesList = src);
    this.lvlSubscription = this.logService.GetLevels().subscribe(lvl => this.levelsList = lvl);
  }

  ngOnDestroy()
  {
    if(this.logSubscription) this.logSubscription.unsubscribe();
    if(this.srcSubscription) this.srcSubscription.unsubscribe();
    if(this.lvlSubscription) this.lvlSubscription.unsubscribe();
  }

  sourceChange(event:MatCheckboxChange)
  {
    let value = event.source.value;
    if(event.checked)
    {
      this.sourcesFilter.push(value);
    }
    else
    {
      var index = this.sourcesFilter.indexOf(value);
      if (index !== -1) this.sourcesFilter.splice(index, 1);
    }
    this.updateLogFiltered();
  }

  levelChange(event:MatCheckboxChange)
  {
    let value = event.source.value.toUpperCase();
    if(event.checked)
    {
      this.levelsFilter.push(value);
    }
    else
    {
      var index = this.levelsFilter.indexOf(value);
      if (index !== -1) this.levelsFilter.splice(index, 1);
    }
    this.updateLogFiltered();
  }

  searchChange(event:any)
  {
    console.log(event);
    this.keyword = event.target.value;
    this.updateLogFiltered();
  }

  updateLogFiltered()
  {
    this.logsFiltered = this.logs;
    if(this.sourcesFilter.length > 0) this.logsFiltered = this.logsFiltered.filter(x => this.sourcesFilter.includes(x.topic));
    if(this.levelsFilter.length > 0) this.logsFiltered = this.logsFiltered.filter(x => this.levelsFilter.includes(x.level));
    if(this.keyword != '')
    {
      var re = new RegExp(this.keyword, 'gi');
      this.logsFiltered = this.logsFiltered.filter(x => x.event.search(re) != -1);
    }
  }
}
