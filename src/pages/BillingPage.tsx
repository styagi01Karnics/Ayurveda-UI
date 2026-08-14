import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { usePageAction } from '@/app/PageActionContext';

import { PageShell } from '@/components/layout/PageShell';

import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';

import { BillingTable } from '@/components/billing/BillingTable';

import { AppIcon } from '@/components/ui/AppIcon';

import { AsyncStatus } from '@/components/ui/AsyncStatus';

import { FilterControl, ListPanel } from '@/components/ui/ListPanel';

import { SearchField } from '@/components/ui/SearchField';

import { Select } from '@/components/ui/Select';

import { Button } from '@/components/ui/Button';

import { assets } from '@/lib/assets';

import { BILLING_FILTER_OPTIONS } from '@/data/mock/billing';

import { useAsyncData } from '@/hooks/useAsyncData';

import { getInvoices } from '@/lib/api/billing';

import { mapInvoiceToBillingRecord } from '@/lib/api/mappers';

import type { BillingRecord } from '@/types';



function toApiInvoiceStatus(status: string): 'ONGOING' | 'COMPLETED' | undefined {

  if (!status) return undefined;

  if (status.toLowerCase() === 'completed') return 'COMPLETED';

  if (status.toLowerCase() === 'ongoing') return 'ONGOING';

  return undefined;

}



export function BillingPage() {

  const navigate = useNavigate();

  const [patientIdQuery, setPatientIdQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState('');

  const [billInvoiceId, setBillInvoiceId] = useState<string | null>(null);



  const { data: records, loading, error, reload } = useAsyncData(

    async () => {

      const rows = await getInvoices({

        status: toApiInvoiceStatus(statusFilter),

      });

      return rows.map(mapInvoiceToBillingRecord);

    },

    [] as BillingRecord[],

    [statusFilter],

  );



  const headerAction = useMemo(

    () => (

      <Button

        className="gap-1.5 px-4 py-2 text-sm"

        onClick={() => navigate('/billing/generate')}

      >

        <AppIcon src={assets.icons.add} className="h-4 w-4" />

        Generate Invoice

      </Button>

    ),

    [navigate],

  );



  usePageAction(headerAction);



  const filteredRecords = useMemo(() => {

    return records.filter((item) => {

      const matchesId =

        !patientIdQuery ||

        item.patientId.toLowerCase().includes(patientIdQuery.toLowerCase()) ||

        item.secondaryPatientId.toLowerCase().includes(patientIdQuery.toLowerCase());

      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesId && matchesStatus;

    });

  }, [records, patientIdQuery, statusFilter]);



  const handleDownload = (record: BillingRecord) => {
    setBillInvoiceId(record.id);
  };



  return (

    <PageShell>

      <ListPanel

        filters={

          <>

            <FilterControl>

              <SearchField

                placeholder="Patient ID"

                value={patientIdQuery}

                onChange={(e) => setPatientIdQuery(e.target.value)}

              />

            </FilterControl>

            <FilterControl>

              <Select

                placeholder="Status"

                options={[...BILLING_FILTER_OPTIONS.status]}

                value={statusFilter}

                onChange={(e) => setStatusFilter(e.target.value)}

              />

            </FilterControl>

          </>

        }

      >

        <AsyncStatus

          loading={loading}

          error={error}

          onRetry={reload}

          empty={!loading && !error && filteredRecords.length === 0}

          emptyMessage="No billing records found."

        >

          <BillingTable

            embedded

            records={filteredRecords}

            onDownload={handleDownload}

          />

        </AsyncStatus>

      </ListPanel>



      <BillInvoiceModal

        open={Boolean(billInvoiceId)}

        invoiceId={billInvoiceId}

        onClose={() => setBillInvoiceId(null)}

      />

    </PageShell>

  );

}

