export interface ICategory {
    id: string;
    subCategories?: string[];
    isActive?: boolean;
}

export interface IProduct {
    id?: string;
    title: string;
    price: number;
    orignalprice?: number;
    category: string;
    subcategory?: string;
    imageUrl: string;
    imageUrl2?: string;
    imageUrl3?: string;
    sizes?: string;
    colors?: string;
    description?: string;
    sale?: string;
}

export interface ICart {
    createdDate: string;
    items: {
        [key: string]: ICartItem;
    };
}

export interface ICartItem {
    product: IProduct;
    quantity: number;
}

export interface IOrder {
    id?: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    items: ICartItem[];
    amount: number;
    isComplete: boolean;
    userId: string;
    datePlaced: string;
}
