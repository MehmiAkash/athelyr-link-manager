import { useEffect, useRef, useState } from "react";

import GroupChat from "../../components/GroupChat";
import GroupList from "../../components/GroupList";
import CreateSettingsPopup from "../../components/CreateSettingsPopup";
import GroupMenuPopup from "../../components/GroupMenuPopup";
import GroupMembersPopup from "../../components/GroupMembersPopup";
import { useGroups } from "../../context/useGroups";
import { getGroup } from "../../services/groupLinkService";
import { showToast } from "../../services/toastService";

function GroupLinks() {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showSettingsPopup, setShowSettingsPopup] = useState(false);
    const [settingsMode, setSettingsMode] = useState("group");
    const [showMenuPopup, setShowMenuPopup] = useState(false);
    const [menuGroup, setMenuGroup] = useState(null);
    const [menuRole, setMenuRole] = useState(null);
    const [showMembersPopup, setShowMembersPopup] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoadFailed, setInitialLoadFailed] = useState(false);
    const {
        groups,
        groupsLoaded,
        updateGroups,
        ensureGroupsLoaded,
        refreshGroups,
    } = useGroups();
    const menuRequestId = useRef(0);

    useEffect(() => {
        ensureGroupsLoaded().catch((error) => {
            setInitialLoadFailed(true);
            showToast("error", error.message);
        });
    }, [ensureGroupsLoaded]);

    const handleGroupCreated = (group) => {
        const createdGroup = {
            ...group,
            role: group.role ?? "OWNER",
        };
        updateGroups((currentGroups) => [
            createdGroup,
            ...currentGroups.filter(
                (currentGroup) =>
                    currentGroup.groupId !== createdGroup.groupId
            ),
        ]);
        setSelectedGroup(createdGroup);
        setMenuGroup(null);
        setMenuRole(null);
        setShowSettingsPopup(false);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setInitialLoadFailed(false);
        try {
            await refreshGroups();
        } catch (error) {
            setInitialLoadFailed(true);
            showToast("error", error.message);
        } finally {
            setRefreshing(false);
        }
    };

    const handleGroupRemoved = (groupId) => {
        updateGroups((currentGroups) =>
            currentGroups.filter((group) => group.groupId !== groupId)
        );
        setSelectedGroup(null);
        setMenuGroup(null);
        setMenuRole(null);
        setShowMenuPopup(false);
    };

    const handleShowGroupMenu = async (group) => {
        const requestId = ++menuRequestId.current;
        setMenuGroup(group);
        setMenuRole(null);
        setShowMenuPopup(true);

        try {
            const groupDetails = await getGroup(group.groupId);
            if (!groupDetails?.role) {
                throw new Error("Could not determine your group role");
            }

            if (requestId === menuRequestId.current) {
                setMenuRole(groupDetails.role);
                setMenuGroup({
                    ...group,
                    role: groupDetails.role,
                });
            }
        } catch (error) {
            if (requestId === menuRequestId.current) {
                setShowMenuPopup(false);
                setMenuGroup(null);
                showToast("error", error.message);
            }
        }
    };

    const handleShowMembers = () => {
        menuRequestId.current += 1;
        setShowMenuPopup(false);
        setMenuRole(null);
        setShowMembersPopup(true);
    };

    const handleAddMember = () => {
        menuRequestId.current += 1;
        setShowMenuPopup(false);
        setMenuRole(null);
        setSettingsMode("member");
        setShowSettingsPopup(true);
    };

    return (
        <div className="w-full pt-14 sm:pt-16">
            {selectedGroup ? (
                <GroupChat
                    group={selectedGroup}
                    onBack={() => setSelectedGroup(null)}
                    onMenu={() => handleShowGroupMenu(selectedGroup)}
                />
            ) : (
                <GroupList
                    groups={groups}
                    loading={
                        !groupsLoaded &&
                        groups.length === 0 &&
                        !initialLoadFailed
                    }
                    refreshing={refreshing}
                    onCreateGroup={() => {
                        setSettingsMode("group");
                        setShowSettingsPopup(true);
                    }}
                    onRefresh={handleRefresh}
                    onSelectGroup={setSelectedGroup}
                    onGroupMenu={handleShowGroupMenu}
                />
            )}

            {showSettingsPopup && (
                <CreateSettingsPopup
                    selectedGroup={selectedGroup ?? menuGroup}
                    mode={settingsMode}
                    onClose={() => {
                        setShowSettingsPopup(false);
                        setMenuGroup(null);
                    }}
                    onGroupCreated={handleGroupCreated}
                    onMemberAdded={() => {}}
                />
            )}

            {showMenuPopup && (
                <GroupMenuPopup
                    group={menuGroup}
                    currentUserRole={menuRole}
                    roleLoading={!menuRole}
                    onGroupRemoved={handleGroupRemoved}
                    onClose={() => {
                        menuRequestId.current += 1;
                        setShowMenuPopup(false);
                        setMenuGroup(null);
                        setMenuRole(null);
                    }}
                    onShowMembers={handleShowMembers}
                    onAddMember={handleAddMember}
                />
            )}

            {showMembersPopup && (
                <GroupMembersPopup
                    group={menuGroup}
                    currentUserRole={menuGroup?.role}
                    onClose={() => {
                        setShowMembersPopup(false);
                        setMenuGroup(null);
                        setMenuRole(null);
                    }}
                />
            )}
        </div>
    );
}

export default GroupLinks;
