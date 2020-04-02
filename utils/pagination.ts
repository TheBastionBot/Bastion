/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

const paginate = (list: unknown[], page: number): { page: number; pages: number; items: unknown[] } => {
    const pages = Math.round(list.length / 10);
    page = Math.round(page > 0 && page <= pages ? page : 1);

    return {
        page,
        pages,
        items: list.slice((page - 1) * 10, ((page - 1) * 10) + 10),
    };
};


export {
    paginate,
};
