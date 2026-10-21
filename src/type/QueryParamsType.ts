export interface IQueryParams {
    search?: string;
    page?: string;
    limit?: string;
    sort?: string;
    order?: string;
    filter?: string;
    [key: string]: string | undefined
}


export interface IQuery<TWhere = Record<string, unknown>> {
    where: TWhere;
    orderBy?: Record<string, "asc" | "desc">;
    skip?: number;
    take?: number;
    build?: () => void
    getMeta?: (model:any) => void
}
