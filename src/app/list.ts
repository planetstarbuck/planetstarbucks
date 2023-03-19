export interface List {
    id: string;
    _id?: Array<Oid>;
    listId: number;
    listImageUrl?: string; 
    chapters?: string;  
    // chapters?: Array<string>;  
    listTitle: string;  
    listCreator?: string;  
    listAdded?: string;
    listLastModified?: string;
    shortlist?: Array<Shortlist>;
    sublist: Array<Sublist>;
}
export interface Oid {
    $oid: string;
}
export interface Sublist {
    subListId: number;
    subListImageUrl?: string;
    subListCreator?: string;
    subListAdded?: string;
    subListLastChange?: string;
    numberOfSaves?: number;
    item: Array<Item>;
}
export interface Item {
    _id?: string;
    commentId?: any;
    positionId?: number;
    itemScore?: number;
    itemTitle?: string;
    itemUrl?: string;
    itemImageUrl?: string;
    itemContext?: string;
    commentsCount?: number;
}
export interface Shortlist {
    listTitle?: string;  
    shortlistLastChanged?: any;
    itemTitle?: string;  
    chapters?: string;  
    sublistCreators?: Array<string>;  
    shortlistItem: Array<ShortlistItem>;
}
export interface ShortlistItem {
    itemTitle: string;
    totalScore: number;
    count: number;
    itemComment: Array<ItemComment>;
}
export interface ItemComment {
    itemCommentCreator: string;
    itemCommentText?: string;
}
export interface Chapters {
    chapters: Array<string>;
}

export interface CommentContent {
    commentContent?: string;
}

export interface Comment {
    itemCommentId: Array<Uuid>;
    comments: Array<CommentContent>;
}

export interface Uuid {
    $uuid: string;
}


export interface Notification {
    id: string;
    type: string;
    title: string;
    text: string;
    read: boolean;
    date: string;
    link: string;
    link_label: string;
    username: string;
}
