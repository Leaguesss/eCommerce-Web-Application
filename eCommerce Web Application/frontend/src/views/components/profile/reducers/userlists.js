
export default function userListsReducer (posts = [],action){
    switch (action.type) {
        case 'FETCH_USER_LISTS':
            return action.payload;
        case 'UPDATE_RATING':
            return posts.map((post) => post._id === action.payload._id ? action.payload : post);
        case 'UPDATE_COMMENT':
            return posts.map((post) => post._id === action.payload._id ? action.payload : post);
        case 'DELETE_COMMENT':
            return posts.filter((post) => post._id !== action.payload._id);
        default:
            return posts;
    }

} 