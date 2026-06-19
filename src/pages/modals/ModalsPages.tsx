import { Link } from "react-router-dom";
import { Modal, PrimaryButton, OutlineButton } from "../../components/ui";
import { AppLayout } from "../../layouts/AppLayout";
import { Card } from "../../components/ui";

export function LogoutPopup() {
  return (
    <>
      <AppLayout title="Dashboard"><div /></AppLayout>
      <Modal title="Log Out" backTo="/dashboard">
        <p>Are you sure you want to log out of your account?</p>
        <div className="mt-4 flex gap-3">
          <PrimaryButton to="/login">Log Out</PrimaryButton>
          <OutlineButton to="/dashboard">Cancel</OutlineButton>
        </div>
      </Modal>
    </>
  );
}

export function OfferPopup() {
  return (
    <>
      <AppLayout title="Dashboard"><div /></AppLayout>
      <Modal title="Special Offer" backTo="/dashboard">
        <p>Get Up to 50% Off on Ayurvedic Medicines & Wellness Products!</p>
        <p className="mt-2 text-sm text-text-secondary">Limited time offer. Claim now to avail discounts on your next order.</p>
        <PrimaryButton to="/dashboard" className="mt-4">Claim Offer</PrimaryButton>
      </Modal>
    </>
  );
}

export function ProfileDropdownPage() {
  return (
    <AppLayout title="Dashboard" showBanner={false}>
      <div className="relative">
        <Card className="absolute right-0 top-0 w-56 shadow-lg">
          <ul className="space-y-1 text-sm">
            <li><Link to="/my-profile" className="block rounded px-3 py-2 hover:bg-gold-light">My Profile</Link></li>
            <li><Link to="/change-password" className="block rounded px-3 py-2 hover:bg-gold-light">Change Password</Link></li>
            <li><Link to="/settings" className="block rounded px-3 py-2 hover:bg-gold-light">Settings</Link></li>
            <li><Link to="/dashboard/logout-popup" className="block rounded px-3 py-2 text-danger hover:bg-red-50">Log Out</Link></li>
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}

export function MyProfilePage() {
  return (
    <AppLayout title="My Profile">
      <Card>
        <form className="max-w-lg space-y-4">
          {["Full Name", "Email", "Phone", "Role"].map((f) => (
            <div key={f}>
              <label className="mb-1 block text-sm font-medium">{f}</label>
              <input
                defaultValue={f === "Full Name" ? "Rahul Sharma" : f === "Role" ? "Super Admin" : ""}
                className="w-full rounded-lg border border-stroke px-3 py-2 text-sm"
              />
            </div>
          ))}
          <PrimaryButton to="/dashboard">Save Profile</PrimaryButton>
        </form>
      </Card>
    </AppLayout>
  );
}

export function ChangePasswordPage({ success = false }: { success?: boolean }) {
  return (
    <>
      <AppLayout title="Dashboard"><div /></AppLayout>
      <Modal title="Change Password" backTo="/dashboard">
        {success ? (
          <p className="text-success-text">Password changed successfully!</p>
        ) : (
          <form className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Current Password</label>
              <input type="password" className="w-full rounded border border-stroke px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm">New Password</label>
              <input type="password" className="w-full rounded border border-stroke px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm">Confirm Password</label>
              <input type="password" className="w-full rounded border border-stroke px-3 py-2 text-sm" />
            </div>
            <PrimaryButton to="/change-password/success">Update Password</PrimaryButton>
          </form>
        )}
      </Modal>
    </>
  );
}

export function AppointmentCancelledToast() {
  return (
    <AppLayout title="Appointments">
      <div className="fixed bottom-6 right-6 rounded-lg bg-brown px-4 py-3 text-sm text-white shadow-lg">
        Appointment cancelled successfully
      </div>
      <Card><p className="text-muted">Appointment list updated.</p></Card>
    </AppLayout>
  );
}

export function FollowUpPopup() {
  return (
    <>
      <AppLayout title="Appointments"><div /></AppLayout>
      <Modal title="Schedule Follow-Up" backTo="/appointments">
        <form className="space-y-3">
          <div>
            <label className="mb-1 block text-sm">Date</label>
            <input type="date" className="w-full rounded border border-stroke px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Time</label>
            <input type="time" className="w-full rounded border border-stroke px-3 py-2 text-sm" />
          </div>
          <PrimaryButton to="/appointments">Schedule</PrimaryButton>
        </form>
      </Modal>
    </>
  );
}

export function ScheduledAppointmentPopup() {
  return (
    <>
      <AppLayout title="Appointments"><div /></AppLayout>
      <Modal title="Scheduled Appointment" backTo="/appointments/calendar">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Patient</dt><dd>Khushi Shroff</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Doctor</dt><dd>Dr. Sheekha</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Date</dt><dd>15 Oct 2026</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Time</dt><dd>01:05 AM</dd></div>
        </dl>
      </Modal>
    </>
  );
}

export function ConfirmBookingPopup() {
  return (
    <>
      <AppLayout title="Create New Patient"><div /></AppLayout>
      <Modal title="Confirm Appointment Booking" backTo="/appointments/create-patient/step-3">
        <p>Appointment booked successfully for the new patient.</p>
        <PrimaryButton to="/appointments" className="mt-4">View Appointments</PrimaryButton>
      </Modal>
    </>
  );
}

export function BillDownloadPage() {
  return (
    <AppLayout title="Bill Download">
      <Card>
        <p className="mb-4 text-sm">Bill for patient #PT458652 — Khushi Shroff</p>
        <p className="text-2xl font-semibold text-brown">₹12,500</p>
        <PrimaryButton className="mt-4">Download PDF</PrimaryButton>
      </Card>
    </AppLayout>
  );
}

export function UploadDocumentPage() {
  return (
    <AppLayout title="Upload Document">
      <Card>
        <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-stroke p-12">
          <p className="mb-2 text-sm text-muted">Drag and drop files here or click to browse</p>
          <input type="file" className="text-sm" />
          <PrimaryButton className="mt-4">Upload</PrimaryButton>
        </div>
      </Card>
    </AppLayout>
  );
}

export function AddMedicineConfirmPopup() {
  return (
    <>
      <AppLayout title="Add Medicine"><div /></AppLayout>
      <Modal title="Confirm" backTo="/medicines/add">
        <p>Medicine added successfully to inventory.</p>
        <PrimaryButton to="/medicines" className="mt-4">Back to Medicines</PrimaryButton>
      </Modal>
    </>
  );
}

export function DeleteMedicinePopup() {
  return (
    <>
      <AppLayout title="Medicines"><div /></AppLayout>
      <Modal title="Delete Medicine" backTo="/medicines">
        <p>Are you sure you want to delete this medicine from inventory?</p>
        <div className="mt-4 flex gap-3">
          <button type="button" className="rounded bg-danger px-4 py-2 text-sm text-white">Delete</button>
          <OutlineButton to="/medicines">Cancel</OutlineButton>
        </div>
      </Modal>
    </>
  );
}

export function PrescriptionDownloadPage() {
  return (
    <AppLayout title="Prescription">
      <Card>
        <h2 className="mb-4 font-semibold">Prescription — Khushi Shroff</h2>
        <p className="text-sm text-brown-muted">Dr. Sheekha · 15 Oct 2026</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>Tab OCRIS 200 — 1 tab twice daily after meals</li>
          <li>Triphala Powder — 1 tsp at bedtime</li>
        </ul>
        <PrimaryButton className="mt-6">Download Prescription</PrimaryButton>
      </Card>
    </AppLayout>
  );
}

export function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <h1 className="text-6xl font-bold text-gold">404</h1>
      <p className="mt-4 text-xl font-semibold text-brown">Page Not Found</p>
      <p className="mt-2 text-text-secondary">The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="mt-6 rounded-lg bg-gold px-6 py-2 font-bold text-white hover:bg-gold/90">
        Go to Dashboard
      </Link>
    </div>
  );
}
