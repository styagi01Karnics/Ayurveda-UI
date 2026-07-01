import { useMemo, useState } from 'react';
import { usePageAction } from '@/app/PageActionContext';
import { PageShell } from '@/components/layout/PageShell';
import { ClinicSettingsTab } from '@/components/settings/ClinicSettingsTab';
import { RoleManagementTab } from '@/components/settings/RoleManagementTab';
import { SystemPreferenceTab } from '@/components/settings/SystemPreferenceTab';
import { UserManagementTab } from '@/components/settings/UserManagementTab';
import { AppIcon } from '@/components/ui/AppIcon';
import { Button } from '@/components/ui/Button';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { assets } from '@/lib/assets';
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
          <AppIcon src={assets.icons.add} className="h-4 w-4" />
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
          <AppIcon src={assets.icons.add} className="h-4 w-4" />
          Add New Role
        </Button>
      );
    }
    return null;
  }, [activeTab]);

  usePageAction(headerAction);

  return (
    <PageShell>
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
    </PageShell>
  );
}
