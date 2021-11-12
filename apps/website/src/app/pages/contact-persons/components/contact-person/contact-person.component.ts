import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContactPerson } from '@svv/core/models';

@Component({
  selector: 'contact-person',
  templateUrl: './contact-person.component.html',
  styleUrls: ['./contact-person.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPersonComponent {
  @Input() contactPerson: ContactPerson;
  @Input() loading: boolean;
}
