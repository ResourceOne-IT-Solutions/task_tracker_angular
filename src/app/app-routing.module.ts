import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'User-page',
    component: UserPageComponent,
    canActivate: [guardGuard],
  },
  { path: 'Chat-Box', component: ChatBoxComponent, canActivate: [guardGuard] },
  {
    path: 'User-page',
    component: UserPageComponent,
    canActivate: [guardGuard],
  },
  { path: 'tickets', component: TicketsComponent, canActivate: [guardGuard] },
  {
    path: 'client-tickets',
    component: ClientTicketsComponent,
    canActivate: [guardGuard],
  },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
