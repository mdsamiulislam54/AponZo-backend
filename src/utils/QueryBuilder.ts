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
            const where: any = {};
            filters.forEach(filter => {
                let [key, value] = filter.split(":");
                if (value.includes("-")) {
                    const [min, max] = value.split("-");
                    where[key] = {
                        gte: Number(min),
                        lte: Number(max)
                    }

                } else {
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

    sort() {
        const sortBy = this.params.sortBy || "createdAt"
        const sortOrder = this.params.sortOrder === "asc" ? "asc" : "desc";
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        console.log(sortBy, sortOrder)
        this.query.orderBy = {
            [sortBy]: sortOrder
        }

        return this;

    }

    paginate() {
        this.page = Number(this.params.page) || 1;
        this.limit = Number(this.params.limit) || 10;
        this.skip = (this.page - 1) * this.limit;
        this.query.skip = this.skip;
        this.query.take = this.limit;
        return this;

    }

   async getMeta(model:any){
        const total = await model.count({
            where: this.query.where
        });

        return {
            total,
            page: this.page,
            limit: this.limit,
            totalPages: Math.ceil(total / this.limit)
        }
    }


   
}