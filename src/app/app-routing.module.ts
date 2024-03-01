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
import { TicketdescriptionComponent } from './components/ticket-description/ticket-description.component';
import { FeedBackComponent } from './components/feed-back/feed-back.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

const routes: Routes = [
  { path: '', component: WelComePageComponent },
  {
    path: 'login_page',
    component: LoginPageComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotpasswordComponent,
  },
  {
    path: 'dashboard',
    component: MainDashboardComponent,
    children: [
      {
        path: '',
        component: DashBoardComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'Chat-Box',
        component: ChatBoxComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'tickets',
        component: TicketsComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'user/:id',
        component: UserPageComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
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
      {
        path: 'client-tickets/:id',
        component: ClientTicketsComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'tickets/client/:id',
        component: TicketsComponent,
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
      {
        path: 'user-tickets',
        component: UserlistComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'helped-tickets',
        component: UserlistComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'ticket-description/:id',
        component: TicketdescriptionComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'feed-back',
        component: FeedBackComponent,
        canActivate: [guardGuard],
      },
      {
        path: 'feed-back-list',
        component: FeedBackComponent,
        canActivate: [guardGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
