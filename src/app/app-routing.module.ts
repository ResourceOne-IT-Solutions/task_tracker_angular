import { NgModule, Type } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { WelComePageComponent } from './components/welcome-page/welcome-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { guardGuard } from './services/auth/guard.guard';
import { UserPageComponent } from './components/user-page/user-page.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';

import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { ClientTicketsComponent } from './components/client-tickets/client-tickets.component';
import { ViewRequestPageComponent } from './components/view-request-page/view-request-page.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { adminGuard } from './services/admin/admin.guard';
import { UserlistComponent } from './components/userlist/userlist.component';


const routes: Routes = [
  { path: '', component: WelComePageComponent },
  {
    path: 'login_page',
    component: LoginPageComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'dashboard',
    component: MainDashboardComponent,
    canActivate: [guardGuard],
    children: [
      { path: '', component: DashBoardComponent , canActivate : [guardGuard ,adminGuard] },
      { path: 'Chat-Box', component: ChatBoxComponent, canActivate: [guardGuard] },
      { path: 'tickets', component: TicketsComponent, canActivate: [guardGuard] },
      { path: 'user/:id', component: UserPageComponent, canActivate: [guardGuard] },
      { path: 'create-user', component: CreateUserComponent, canActivate: [guardGuard] },
      {
        path: 'view-requestPage',
        component: ViewRequestPageComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'user-view-request',
        component: UserViewComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'client-tickets',
        component: ClientTicketsComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'user-list',
        component: UserlistComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'client-list',
        component: UserlistComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'today-tickets',
        component: UserlistComponent,
        canActivate: [guardGuard],
      },
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
