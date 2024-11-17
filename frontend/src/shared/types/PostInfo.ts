export interface PostInfo {
    readonly _id: string;
    readonly title: string;
    readonly city: string;
    readonly country: string;
    readonly preview: string;
    readonly description: string;
    readonly bedrooms: number;
    readonly bathrooms: number;
    readonly area: number;
    readonly floor: number;
    readonly parking: number;
    readonly price: number;
    readonly category: string;
    readonly createdAt: Date;
}

export interface PropItems {
    propItems: PostInfo[];
}
