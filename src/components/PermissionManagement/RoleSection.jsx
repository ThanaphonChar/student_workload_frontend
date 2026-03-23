import MemberList from './MemberList';

export default function RoleSection({ roleKey, title, members, onOpenAdd, onRemove, removingKey }) {
    return (
        <MemberList
            roleKey={roleKey}
            title={title}
            members={members}
            onOpenAdd={onOpenAdd}
            onRemove={onRemove}
            removingKey={removingKey}
        />
    );
}
