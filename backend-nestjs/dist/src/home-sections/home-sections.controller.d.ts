import { PrismaService } from '../prisma/prisma.service';
export declare class HomeSectionsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHomeSections(): Promise<({
        id: string;
        key: string;
        order: number;
        enabled: boolean;
        title: string;
        color1: string;
        color2: string;
        data?: undefined;
        subtitle?: undefined;
    } | {
        id: string;
        key: string;
        order: number;
        enabled: boolean;
        color1: string;
        color2: string;
        title?: undefined;
        data?: undefined;
        subtitle?: undefined;
    } | {
        id: string;
        key: string;
        order: number;
        enabled: boolean;
        title?: undefined;
        color1?: undefined;
        color2?: undefined;
        data?: undefined;
        subtitle?: undefined;
    } | {
        id: string;
        key: string;
        order: number;
        enabled: boolean;
        title: string;
        data: {
            id: number;
            title: string;
            content: string;
            thumbnail: string | null;
            published_at: Date;
        }[];
        color1?: undefined;
        color2?: undefined;
        subtitle?: undefined;
    } | {
        id: string;
        key: string;
        order: number;
        enabled: boolean;
        title: string;
        color1?: undefined;
        color2?: undefined;
        data?: undefined;
        subtitle?: undefined;
    } | {
        id: string;
        key: string;
        order: number;
        enabled: boolean;
        title: string;
        subtitle: string;
        color1?: undefined;
        color2?: undefined;
        data?: undefined;
    })[]>;
}
