import {
  Component,
  Input,
  SimpleChanges,
  NgZone,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilitiesService } from '../utilities';
declare var elements: any;
declare var stripe: any;
declare var Stripe: any;
declare var window: any;

export class StripeCardModel {
  accountId: string;
  address_zip: string;
  address_zip_check: string;
  brand: string;
  country: string;
  customer: string;
  cvc_check: string;
  default_for_currency: boolean;
  exp_month: number;
  exp_year: number;
  funding: string;
  id: string;
  last4: string;
  object: string;
}

@Component({
  templateUrl: './payment-method-entry.component.html',
  styleUrls: ['./payment-method-entry.component.css'],
  selector: 'app-payment-method-entry',
})
export class PaymentMethodEntryComponent implements 
  AfterViewInit, OnChanges {
  @Input() customerId: string;
  @Input() selectedCard: StripeCardModel;
  @Input() paymentAmount: number = 0;
  @Input() paymentDescription: string = 'Payment';
  @Output()
  selectedCardChange: EventEmitter<StripeCardModel> = new EventEmitter();
  @Input() buttonText = 'Next';
  @Input() newCardButtonText = 'Save Card to Wallet';
  @Input() newCustomerMode = false;
  @Input() cardGetUrl: string;
  @Input() hideManualCreditCardEntry = false;

  @Output() newCardCreated: EventEmitter<void> = new EventEmitter();
  mobileCardIndex = 0;

  card: any;
  @Input() existingCards: StripeCardModel[];
  @Input() addingNewCard = false;
  @Output() addingNewCardChange: EventEmitter<boolean> = new EventEmitter();
  @Input() hideSaveCardToWalletButton = false;
  canSubmit = false;
  @Input() savingPaymentMethod = false;
  @Output() savingPaymentMethodChange: EventEmitter<boolean> = new EventEmitter();
  @Input() canDelete = true;
  refreshingCards = false;
  initialized: boolean;
  stripeInitialized = false;
  private swipeAdjustment = 0;

  constructor(
      private zone: NgZone,
      private sanitization: DomSanitizer,
  ) { }

  private refreshExistingCards() {
      if (this.newCustomerMode) {

          if (!this.existingCards) {
              this.existingCards = [];
          }
          return;
      }
      this.refreshingCards = true;

  }
  ngOnChanges(changes: SimpleChanges) {
      if (changes.customerId && changes.customerId.currentValue) {
          this.initialized = false;
          this.refreshExistingCards();

      } else if (changes.customerId && !changes.customerId.currentValue) {
          this.initialized = false;

      }
      if (changes.newCustomerMode && changes.newCustomerMode.currentValue) {
          this.addingNewCard = true;
          this.addingNewCardChange.emit(this.addingNewCard);
      }
  }

  showAddNewCard() {
      this.addingNewCard = true;
      this.addingNewCardChange.emit(this.addingNewCard);
  }



  selectCard(card: StripeCardModel) {
      this.selectedCard = card;
      this.selectedCardChange.emit(card);
      if (!this.existingCards) {
          this.existingCards = [];
          this.existingCards.push(card);
      }
      this.mobileCardIndex = this.existingCards.indexOf(card);
  }

  nextMobileCard() {
      if (this.mobileCardIndex < this.existingCards.length - 1) {
          this.mobileCardIndex += 1;
      } else {
          this.mobileCardIndex = 0;
      }
      this.selectCard(this.existingCards[this.mobileCardIndex]);
  }

  prevMobileCard() {
      if (this.mobileCardIndex > 0) {
          this.mobileCardIndex -= 1;
      } else {
          this.mobileCardIndex = this.existingCards.length - 1;
      }
      this.selectCard(this.existingCards[this.mobileCardIndex]);
  }


  ngAfterViewInit() {
      this.setupSwipeDetect();
  }

  private setupSwipeDetect() {
      if (document.getElementById('mobile-card-container')) {
          UtilitiesService.swipeDetect(document.getElementById('mobile-card-container'), direction => {
              this.swipeAdjustment = 0;
              if (direction === 'left') {
                  this.nextMobileCard();
              }

              if (direction === 'right') {
                  this.prevMobileCard();
              }
              setTimeout(() => this.swipeAdjustment = 0, 100);
          }, distX => {
              const maxThreshold = 100;
              if (distX < -maxThreshold) {
                  distX = -maxThreshold;
              }
              if (distX > maxThreshold) {
                  distX = maxThreshold;
              }
              this.swipeAdjustment = -distX;
          });
      } else {
          setTimeout(() => this.setupSwipeDetect(), 500);
      }
  }

  closeAddingNewCard() {
      this.addingNewCard = false;
      this.addingNewCardChange.emit(this.addingNewCard);
      this.setupSwipeDetect();
  }

  get mobileCardContainerTransform() {
      return this.sanitization.bypassSecurityTrustStyle(`translateX(calc(50%  - ${this.mobileCardIndex * 209 + 94.5 + this.swipeAdjustment}px))`);
  }



}
