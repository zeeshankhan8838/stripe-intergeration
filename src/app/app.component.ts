import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'stripe-intergeration';

  @ViewChild('cardInfo', { static: false }) cardInfo!: ElementRef;

  stripe: any;
  loading = false;
  confirmation: any;

  card: any;
  cardHandler = this.onChange.bind(this);
  error!: string;

  constructor(
    private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService
  ) {}

  async ngAfterViewInit() {
    let stripe = await this.stripeService.setPublishableKey(
      'pk_test_2syov9fTMRwOxYG97AAXbOgt008X6NL46o'
    );
    this.stripe = stripe;
    const elements = stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }: any) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null as any;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Success!', token);
    }
  }
}
