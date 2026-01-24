'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function StickyCardsAnimation() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const scroller = document.documentElement;
        const cards = gsap.utils.toArray<HTMLElement>('.sticky-cards .card');

        cards.forEach((card, index) => {
            if (card.id === 'card2') return;
            if (index > cards.findIndex(c => c.id === "card2")) return;

            if (index === cards.length - 1) return;

            const cardInner = card.querySelector('.card-inner');
            const nextCard = cards[index + 1];

            if (!cardInner || !nextCard) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    // trigger: nextCard,
                    // start: 'top 85%',
                    // end: 'top -75%',
                    trigger: card,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    pin: card,
                    pinSpacing: false,
                    scroller
                }
            });

            tl.to(cardInner, {
                y: '-50%',
                z: -250,
                rotationX: 45,
                ease: 'none'
            }).to(
                cardInner,
                {
                    '--after-opacity': 1,
                    ease: 'none'
                },
                0.15
            );
        });

        ScrollTrigger.refresh();

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return null;
}
