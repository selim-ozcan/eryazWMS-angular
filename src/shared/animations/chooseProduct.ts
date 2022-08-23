import { trigger, state, animate, style, transition } from '@angular/animations';

export function chooseProduct() {
    return trigger('productAddition', [
        state('void', style({ opacity: '0', transform: 'scale(.5)' })),
        state('added', style({ transform: 'scale(1)', opacity: '1' })),
        transition('void => added', [
            animate('0.3s ease-out'), style({ transform: 'scale(1)', opacity: '1' })
        ])
    ]);
}