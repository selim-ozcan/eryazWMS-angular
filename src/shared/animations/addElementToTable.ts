import { trigger, state, animate, style, transition } from '@angular/animations';

export function addElementAnimation() {
    return trigger('elementAddition', [
        state('void', style({ opacity: '0', transform: 'translateX(-50px)' })),
        state('added', style({ transform: 'translateX(0)', opacity: '1' })),
        transition('void => added', [
            animate('0.3s ease-out'), style({ transform: 'translateX(0)', opacity: '1' })
        ])
    ]);
}