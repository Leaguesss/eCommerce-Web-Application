
export default function usersReducer (users = [],action){
    switch (action.type) {
        case 'FETCH_USER':
            return action.payload;
        case 'UPDATE_USR':
            return users._id === action.payload._id ? action.payload : users;
        case 'FETCH_USER_LISTS':
            return action.payload;
        default:
            return users;
    }

} 