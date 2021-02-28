/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

const paginate = (list: unknown[], page: number): { page: number; pages: number; items: unknown[] } => {
    const pages = Math.ceil(list.length / 10);
    page = Math.floor(page > 0 && page <= pages ? page : 1);

    return {
        page: pages ? page : 0,
        pages,
        items: list.slice((page - 1) * 10, ((page - 1) * 10) + 10),
    };
};


export {
    paginate,
};
