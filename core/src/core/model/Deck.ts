import { Card } from "./Card";

interface Deck {
    name: string | null;
    cards: {
        [key: string]: Card[];
    };
}

export { Deck };
