import type { Card } from "../card/Card";
import type { Vendor } from "./Vendor";
import type { Currency } from "./Currency";
import { DefaultVendor } from "./Vendor";

export interface PriceLookupResult {
	readonly price: number;
	readonly missing: ReadonlyArray<Card>;
}

const prices = 
    {

        "(C)": 1,
        "(R)": 3,
    "(SP)": 3,
    "(SSP)": 3,
    "(SR)": 5,
    "(UR)": 7,
    "(ScR)": 7,
    };

export class PriceService {
	/**
	 * Formats a price for its currency.
	 *
	 * @param value Value to format.
	 * @param currency Currency to format for.
	 * @return formatted price.
	 */
	formatPrice(value: number, currency: Currency): string {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency.id,
		}).format(value);
	}

	/**
	 * Gets the price of the card(s) for the given vendor and currency, using the sum of all existing prices.
	 *
	 * @param cards Cards to check.
	 * @param vendor Vendor to get the price for.
	 * @return Object containing total sum for this vendor's currency, as well as a list of cards for which no price
	 * could be found.
	 */
	getPrice(cards: ReadonlyArray<Card>, vendor: Vendor): PriceLookupResult {
		let price = 0;
		const missing: Card[] = [];
		
		for (const card of cards) {
			if (card.prices.has(vendor)) {
				const cardPrice = card.prices.get(vendor)!;
				price += cardPrice;
			} else {
				missing.push(card);
			}
		}
		return { price, missing };
	}
}
