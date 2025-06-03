import { ReactElement } from "react";

export enum GameState {
    NOT_STARTED = 0,
    IN_PROGRESS = 1,
    LOCKED = 2,
    RECALL = 3,
    ENDED = 4,
}

export interface GameArenaComponents {
    aboveBoard?: ReactElement;
    gameBoard?: ReactElement;
    belowBoard?: ReactElement;
}

export interface GameData {
    gameId: string;
    items: [GameItem];
}

export interface GameItem {
    id: string;
    objectUrl: string;
    names: string[];
}

export enum ResultClassification {
    TRUE_POSITIVE = "true_positive",
    FALSE_POSITIVE = "false_positive",
    FALSE_NEGATIVE = "false_negative",
}

export interface RecallResult {
    itemId: string;
    recalledItemName: string;
    classification: ResultClassification;
}

