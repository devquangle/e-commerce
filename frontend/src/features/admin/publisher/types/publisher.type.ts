import type { BaseStatus } from "@/types/status";

export interface PublisherResponse {
    id: number;
    name: string;
    slug: string;
    street:string;
    status:BaseStatus;
}

export interface PublisherRequest {
    name: string;
    street:string;
    status:BaseStatus;
}