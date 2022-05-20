import { CurrencyPipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'specialCurrency' })
export class SpecialCurrencyPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        const currencyPipe = new CurrencyPipe('en-US', 'USD');
        if (value === Math.round(value)) {
            return '$' + currencyPipe.transform(value, 'USD', '', '1.0-0');
        } else {
            return '$' + currencyPipe.transform(value, 'USD', '', '1.2-2');
        }
    }
}