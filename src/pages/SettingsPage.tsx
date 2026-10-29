import { useMemo, useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { ClinicSettingsTab } from '@/components/settings/ClinicSettingsTab';
import { RoleManagementTab } from '@/components/settings/RoleManagementTab';
import { SystemPreferenceTab } from '@/components/settings/SystemPreferenceTab';
import { UserManagementTab } from '@/components/settings/UserManagementTab';
import { AppIcon } from '@/components/ui/AppIcon';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { assets } from '@/lib/assets';
import { SETTINGS_TABS } from '@/data/mock/settings';
import { cn } from '@/lib/utils';
import type { SettingsTab } from '@/types';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('clinic');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);

  const headerAction = useMemo(() => {
    if (activeTab === 'users') {
      return (
        <Button
          className="gap-1.5 px-4 py-2 text-sm mb-[2px]"
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

  return (
    <PageShell>
      <Card className="flex min-h-[calc(100vh-11rem)] flex-col p-6 sm:px-8 sm:py-7">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#eadfc8]">
        <nav
          className="grid min-w-0 flex-1 grid-cols-2 sm:grid-cols-4"
          aria-label="Settings sections"
        >
          {SETTINGS_TABS.map((tab) => {
            const isCurrent = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isCurrent ? 'page' : undefined}
                className="flex justify-start"
              >
                <span
                  className={cn(
                    'relative pb-3 text-sm font-medium transition-colors',
                    isCurrent ? 'text-gold' : 'text-brown',
                  )}
                >
                  {tab.label}
                  {isCurrent ? (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gold" />
                  ) : null}
                </span>
              </button>
            );
          })}
        </nav>
        {headerAction}
        </div>

        <div className="flex-1 pt-6">
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
      </Card>
    </PageShell>
  );
}
