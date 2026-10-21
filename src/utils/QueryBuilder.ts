import { IQuery, IQueryParams } from "../type/QueryParamsType";

export class QueryBuilder {
    public query: IQuery;
    public params: IQueryParams;
    public page = 1
    public limit = 10
    public skip = 0
    public sortBy: string = "createdAt"
    public sortOrder: "asc" | "desc" = "desc"

    constructor(query: any, params: IQueryParams,) {
        this.params = params;
        this.query = query;

    };

    search(fields: string[]) {
        const search = this.params.search?.trim();
        if (search) {
            this.query.where = {
                OR: fields.map(field => ({
                    [field]: {
                        contains: search,
                        mode: "insensitive"
                    }
                })
                )
            }
        }

        return this;
    }

    filter() {
        const filter = this.params.filter;
        if (filter) {
            const filters = filter.split(",");
            console.log(filters);
            const where: any = {};
            filters.forEach(filter => {
                let [key, value] = filter.split(":");
                if (value.includes("-")) {
                    const [min, max] = value.split("-");
                    console.log(min, max);
                    where[key] = {
                        gte: Number(min),
                        lte: Number(max)
                    }
                    
                }else{
                    where[key] = value;
                }


            });

            this.query.where = {
                ...this.query.where,
                ...where
            }

        }
        return this;
    }

    build(): IQuery {
        return this.query;
    }
}