export declare class StaticDataController {
    getHotlines(): {
        name: string;
        phone: string;
        description: string;
    }[];
    getLocations(): {
        name: string;
        lat: number;
        lng: number;
        address: string;
    }[];
    getFeedbackTypes(): {
        id: number;
        name: string;
    }[];
    search(): {
        results: never[];
    };
}
