const { Ability, AbilityBuilder} = require('@casl/ability');

function getToken(req) {
    let token = 
        req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;

    return token && token.length ? token : null;
}

// policy

const policies = {
    staff(user, {can}) {
        can('update', 'staff-profile', {user_id: user._id});
        can('view', 'staff-profile', {user_id: user._id});
        can('create', 'report');
        can('create', 'permit');
        can('view', 'permit');
        can('view', 'notifications');
        can('read', 'notification')
    },
    admin(user, {can}){
        // can('manage', 'all');
        can('view', 'staff');
        can('create', 'staff-profile');
        can('view', 'staff-detail', {company: user.company});
        can('delete', 'staff', {company: user.company});
        can('update', 'permit', {company: user.company});
        can('view', 'notifications');
        can('read', 'notification')
    }
}

const policyFor = user => {
    let builder = new AbilityBuilder();
    if(user && typeof policies[user.role] === 'function') {
        console.log(`ini role ${user.role}`)
        policies[user.role](user, builder);
    }
    return new Ability(builder.rules)
}

module.exports = {
    getToken,
    policyFor
}