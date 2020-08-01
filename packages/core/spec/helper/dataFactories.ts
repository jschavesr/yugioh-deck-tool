import { Card } from "../../src/core/card/Card";
import { Format } from "../../src/core/card/format/Format";
import { CardImage } from "../../src/core/card/CardImage";
import { CardPrices } from "../../src/core/card/CardPrices";
import { ReleaseInfo } from "../../src/core/card/ReleaseInfo";
import { BanlistInfo } from "../../src/core/card/banlist/BanlistInfo";
import { CardType } from "../../src/core/card/type/CardType";
import { CardSet } from "../../src/core/card/set/CardSet";
import { CardTypeCategory } from "../../src/core/card/type/CardTypeCategory";
import { DefaultBanState } from "../../src/core/card/banlist/BanState";
import { Vendor } from "../../src/core/price/Vendor";
import { DeckPart } from "../../src/core/deck/DeckPart";

const createCardType = (data: {
    name?: string;
    group?: CardTypeCategory;
    sortGroup?: number;
    deckPart?: Set<DeckPart>;
}): CardType => ({
    name: data.name ?? "Spell Card",
    category: data.group ?? CardTypeCategory.SPELL,
    sortGroup: data.sortGroup ?? 0,
    deckParts: data.deckPart ?? new Set([DeckPart.MAIN, DeckPart.SIDE]),
});

const createCard = (data: {
    passcode?: string;
    name?: string;
    description?: string;

    type?: CardType;
    subType?: string;
    attribute?: string | null;
    atk?: number | null;
    def?: number | null;
    level?: number | null;
    pendulumScale?: number | null;
    linkRating?: number | null;
    linkMarkers?: string[] | null;

    sets?: CardSet[];
    image?: CardImage | null;
    prices?: CardPrices | null;

    betaName?: string | null;
    treatedAs?: string | null;
    archetype?: string | null;
    formats?: Format[];
    release?: ReleaseInfo;
    banlist?: BanlistInfo;

    views?: number;
}): Card => ({
    passcode: data.passcode ?? "123",
    name: data.name ?? "name",
    description: data.description ?? "desc",

    type: data.type ?? createCardType({}),
    subType: data.subType ?? "sub type",

    attribute: data.attribute ?? null,
    atk: data.atk ?? null,
    def: data.def ?? null,
    level: data.level ?? null,
    pendulumScale: data.pendulumScale ?? null,
    linkRating: data.linkRating ?? null,
    linkMarkers: data.linkMarkers ?? null,

    sets: data.sets ?? [],
    image: data.image ?? null,
    prices: data.prices ?? new Map<Vendor, number>(),
    betaName: data.betaName ?? null,
    treatedAs: data.treatedAs ?? null,
    archetype: data.archetype ?? null,

    formats: data.formats ?? [Format.TCG, Format.OCG],
    release: { [Format.TCG]: data.release?.TCG ?? null, [Format.OCG]: null },
    banlist: {
        [Format.TCG]: data.banlist?.TCG ?? DefaultBanState.UNLIMITED,
        [Format.OCG]: data.banlist?.OCG ?? DefaultBanState.UNLIMITED,
        [Format.GOAT]: data.banlist?.GOAT ?? DefaultBanState.UNLIMITED,
    },

    views: data.views ?? 0,
});

export { createCard, createCardType };
