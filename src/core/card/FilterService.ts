import { intersection, isEmpty } from "lodash-es";
import type { BanlistService } from "./format/BanlistService";
import type { BanState } from "./format/BanState";
import type { Card } from "./Card";
import type { CardPredicate } from "./CardPredicateService";
import type { CardService } from "./CardService";
import type { Format } from "./format/Format";
import type { CardSet } from "./set/CardSet";
import type { CardType } from "./type/CardType";
import type { CardTypeCategory } from "./type/CardTypeCategory";
import { DefaultVendor } from "../lib";

export type CardFilter = Partial<{
	/**
	 * Custom filter parts (e.g. user owned cards).
	 * Executed in order.
	 * If all predicates return true, the card is included in the result.
	 */
	customPredicates: CardPredicate[];

	/**
	 * Card name (sub)string matcher.
	 */
	name: string | null;

	/**
	 * Card description/effect substring matcher.
	 */
	description: string | null;

	/**
	 * This can be used when wanting only type-category accuracy.
	 * For exact type matching see {@link #type}.
	 */
	typeCategory: CardTypeCategory | null;

	/**
	 * This can be used when wanting exact type accuracy.
	 * For type category matching see {@link #typeCategory}.
	 */
	type: CardType | null;
	subType: string | null;

	attribute: string | null;
	level: number | null;
	linkMarkers: string[];

	archetype: string | null;
	format: Format | null;

	/**
	 * Only available if #format is set.
	 */
	banState: BanState | null;

	sets: CardSet[];
}>;

export class FilterService {
	readonly #cardService: CardService;
	readonly #banlistService: BanlistService;

	constructor(cardService: CardService, banlistService: BanlistService) {
		this.#cardService = cardService;
		this.#banlistService = banlistService;
	}

	/**
	 * Filters a list of cards by a filter.
	 *
	 * @param cards Cards to filter.
	 * @param filter Filter to apply. Generally null or empty array properties mean a check should be skipped.
	 * @return Filtered cards.
	 */
	filter(cards: ReadonlyArray<Card>, filter: CardFilter): Card[] {
		const prices :{[key: string] : number} = 
		{

			"(C)": 1,
			"(R)": 3,
			"(SP)": 3,
			"(SSP)": 3,
			"(SR)": 5,
			"(UR)": 7,
			"(ScR)": 7,
		};
		const filteredCards : Card[] =  cards.filter((card) => {
			if (
				filter.customPredicates != null &&
				!filter.customPredicates.every((predicate) => predicate(card))
			) {
				return false;
			}

			if (
				filter.name != null &&
				filter.name.length > 0 &&
				!this.#cardService
					.getAllNames(card)
					.some((name) =>
						name.toLowerCase().includes(filter.name!.toLowerCase())
					)
			) {
				return false;
			}

			if (
				filter.description != null &&
				filter.description.length > 0 &&
				!card.description
					.toLowerCase()
					.includes(filter.description.toLowerCase())
			) {
				return false;
			}

			if (
				filter.typeCategory != null &&
				card.type.category != filter.typeCategory
			) {
				return false;
			}
			if (filter.type != null && card.type != filter.type) {
				return false;
			}

			if (filter.subType != null && card.subType != filter.subType) {
				return false;
			}
			if (filter.level != null && card.level != filter.level) {
				return false;
			}
			if (
				filter.attribute != null &&
				card.attribute != filter.attribute
			) {
				return false;
			}
			if (
				filter.linkMarkers != null &&
				filter.linkMarkers.length > 0 &&
				(card.linkMarkers == null ||
					filter.linkMarkers.some(
						(linkMarker) => !card.linkMarkers!.includes(linkMarker)
					))
			) {
				return false;
			}
			if (
				filter.archetype != null &&
				card.archetype !== filter.archetype
			) {
				return false;
			}

			if (
				filter.format != null &&
				!card.formats.includes(filter.format)
			) {
				return false;
			}
			if (
				filter.banState != null &&
				filter.format != null &&
				this.#banlistService.getBanStateByFormat(
					card,
					filter.format
				) !== filter.banState
			) {
				return false;
			}
			if (filter.sets === null || (filter.sets != null && filter.sets?.length< 1) ) {
				return false;
			}

			if (
				filter.sets != null &&
				filter.sets.length > 0 &&
				isEmpty(intersection(card.sets.map(set=>set.name), filter.sets.map(set => set.name)))
			) {
				return false;
			}

			return true;
		});
		if (filteredCards.length < 1000 ) {
		filteredCards.forEach((card) => {
			const setNames = filter.sets?.map( set => set.name );
			// console.log("Card: ", card.name)
			let price : number  = 1000; // bigger than any value in prices
			card.sets?.forEach( (set) => {
				// console.log(set.name);
				// console.log(set.raririty_code);
				if (setNames?.includes(set.name)) {
					if (set.raririty_code === undefined) return;
					price = Math.min(price, prices[set.raririty_code]);
				}
			})
			if (price < 1000) card.prices.set(DefaultVendor.CUSTOM, price);
		})
		}
		return filteredCards;
		
	}

	/**
	 * Creates an empty filter instance including all optional fields initialized.
	 *
	 * @return Empty filter.
	 */
	createDefaultFilter(): CardFilter {
		return {
			customPredicates: [],

			name: null,
			description: null,

			typeCategory: null,
			type: null,
			subType: null,

			attribute: null,
			level: null,
			linkMarkers: [],

			archetype: null,
			format: null,
			banState: null,

			sets: [],
		};
	}
}
