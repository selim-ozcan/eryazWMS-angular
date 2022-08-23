import { trigger, state, animate, style, transition } from '@angular/animations';

export function deleteElementAnimation() {
    return trigger('elementDeletion', [
        state('present', style({ opacity: '1', transform: 'translateX(0)' })),
        state('deleted', style({ transform: 'translateX(50px)', opacity: '0' })),
        transition('present => deleted', [
            animate('0.3s ease-out'), style({ transform: 'translateX(50px)', opacity: '0' })
        ])
    ]);
}

export function deleteElementFromDocumentAnimation() {
    return trigger('elementDeletion', [
        state('present', style({ opacity: '1', transform: 'translateX(0)' })),
        state('deleted', style({ transform: 'translateX(50px)', opacity: '0' })),
        transition('* => void', [
            animate('0.3s ease-out'), style({ transform: 'translateX(50px)', opacity: '0' })
        ])
    ]);
}