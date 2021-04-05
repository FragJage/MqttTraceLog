import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogViewerComponent } from './log-viewer/log-viewer.component';
import { LogLevelManagerComponent } from './log-level-manager/log-level-manager.component';

const routes: Routes = [
  { path: '', component: LogViewerComponent },
  { path: 'LogViewer', component: LogViewerComponent },
  { path: 'LogLevelManager', component: LogLevelManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
