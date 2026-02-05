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
            if (index === cards.length - 1) return;
            // ignore card2 for pinning to scroll through animation
            if (card.id === 'card2') return;
            if (index > cards.findIndex(c => c.id === "card2")) return;

            const cardInner = card.querySelector('.card-inner');
            const nextCard = cards[index + 1];

            if (!cardInner || !nextCard) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: nextCard,
                    start: 'top 85%',
                    end: 'top -75%',
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

        const card3 = cards.find(c => c.id === 'card3');
        if (card3) {
            // This trigger pins card3 while card2 fades out on top of it.
            // The start trigger is card3 reaching the top of the viewport.
            // The duration must match the fade-out duration of card2's animation.
            // card2's animation is 600vh total. The fade is the last 20% (from 80% to 100%).
            // Fade duration = 0.20 * 600vh = 120vh.
            ScrollTrigger.create({
                trigger: card3,
                start: 'top top',
                end: '+=120%', // Pin for 120% of viewport height
                pin: true,
                pinSpacing: true, // Add space so card4 flows correctly after
            });
        }

        ScrollTrigger.refresh();

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return null;
}
