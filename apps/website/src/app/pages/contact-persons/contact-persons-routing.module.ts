import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactPersonsComponent } from './contact-persons.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ContactPersonsComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ContactPersonsRoutingModule {}
