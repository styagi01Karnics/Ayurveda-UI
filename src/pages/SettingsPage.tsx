import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePageAction } from '@/app/PageActionContext';
import { ClinicSettingsTab } from '@/components/settings/ClinicSettingsTab';
import { RoleManagementTab } from '@/components/settings/RoleManagementTab';
import { SystemPreferenceTab } from '@/components/settings/SystemPreferenceTab';
import { UserManagementTab } from '@/components/settings/UserManagementTab';
import { Button } from '@/components/ui/Button';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { SETTINGS_TABS } from '@/data/mock/settings';
import type { SettingsTab } from '@/types';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('clinic');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);

  const headerAction = useMemo(() => {
    if (activeTab === 'users') {
      return (
        <Button
          className="gap-1.5 px-4 py-2 text-sm"
          onClick={() => setAddUserOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      );
    }
    if (activeTab === 'roles') {
      return (
        <Button
          className="gap-1.5 px-4 py-2 text-sm"
          onClick={() => setAddRoleOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Role
        </Button>
      );
    }
    return null;
  }, [activeTab]);

  usePageAction(headerAction);

  return (
    <div className="space-y-5">
      <UnderlineTabs
        tabs={SETTINGS_TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'clinic' && <ClinicSettingsTab />}
      {activeTab === 'users' && (
        <UserManagementTab
          addUserOpen={addUserOpen}
          onAddUserClose={() => setAddUserOpen(false)}
        />
      )}
      {activeTab === 'roles' && (
        <RoleManagementTab
          addRoleOpen={addRoleOpen}
          onAddRoleClose={() => setAddRoleOpen(false)}
        />
      )}
      {activeTab === 'system' && <SystemPreferenceTab />}
    </div>
  );
}
