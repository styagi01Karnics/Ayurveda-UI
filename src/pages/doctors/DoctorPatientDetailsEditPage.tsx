import { Link } from "react-router-dom";
import imgAdd from "../../assets/appointments/add.svg";
import imgAlert from "../../assets/appointments/alert.svg";
import imgArrowExit from "../../assets/appointments/arrow-exit.svg";
import imgBounds from "../../assets/appointments/book-btn-bg.svg";
import imgBriefcaseMedical from "../../assets/appointments/briefcase.svg";
import imgCalendarPerson from "../../assets/appointments/calendar-person.svg";
import imgChevron from "../../assets/appointments/chevron.svg";
import imgDataHistogram from "../../assets/appointments/histogram.svg";
import imgDoctor from "../../assets/appointments/doctor.svg";
import imgDocumentBulletList from "../../assets/appointments/document.svg";
import imgEllipse3704 from "../../assets/appointments/ellipse.svg";
import imgEllipse3705 from "../../assets/appointments/ellipse2.svg";
import imgFrame from "../../assets/appointments/close.svg";
import imgFrame1 from "../../assets/doctors/tag-close.svg";
import imgFrame2 from "../../assets/doctors/dropdown-chevron.svg";
import imgFrame3 from "../../assets/doctors/section-close.svg";
import imgFrame4 from "../../assets/appointments/book/calendar-field.svg";
import imgGrid from "../../assets/appointments/grid.svg";
import imgGroup from "../../assets/appointments/arrow-group.svg";
import imgHeartPulse from "../../assets/appointments/heart.svg";
import imgHistory from "../../assets/appointments/history.svg";
import imgImage from "../../assets/appointments/avatar.png";
import imgLine155 from "../../assets/doctors/line155.svg";
import imgLine449 from "../../assets/doctors/line449.svg";
import imgLine450 from "../../assets/doctors/line450.svg";
import imgLine453 from "../../assets/doctors/line453.svg";
import imgLine477 from "../../assets/appointments/line477.svg";
import imgLogo21 from "../../assets/appointments/logo.png";
import imgPerson from "../../assets/appointments/person.svg";
import imgRectangle1 from "../../assets/appointments/sidebar-bg.png";
import imgSettings from "../../assets/appointments/settings.svg";


function DoctorPatientDetailsEditPageInner() {
  return (
    <div className="bg-[#fffef7] relative size-full" data-node-id="1:13946" data-name="Doctors 2 Editable Mode">
      <div className="absolute bg-[#eee4cc] h-[38px] left-[321px] overflow-clip rounded-[10px] top-[24px] w-[1095px]" data-node-id="1:13947">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-[calc(50%-27.5px)] top-[calc(50%+0.5px)]" data-node-id="1:13948">
          <p className="[word-break:break-word] absolute font-['Inter'] leading-[0] left-[calc(50%-300.5px)] not-italic text-[#422c23] text-[14px] top-[calc(50%-8px)] whitespace-pre" data-node-id="1:13949">
            <span className="font-['Inter'] font-medium leading-[normal]">{`Get Up to 50% Off on Ayurvedic Medicines & Wellness Products          `}</span>
            <span className="font-['Inter'] font-semibold leading-[normal] text-[#be880b]">{`  `}</span>
            <Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>
          </p>
        </div>
        <div className="-translate-y-1/2 absolute left-[1063px] size-[20px] top-1/2" data-node-id="1:13950" data-name="Frame">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
        </div>
        <div className="absolute inset-[36.84%_35.61%_32.17%_61.72%]" data-node-id="1:13952" data-name="Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
        </div>
      </div>
      <div className="absolute bg-white h-[969px] left-[24px] overflow-clip rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-[24px] w-[273px]" data-node-id="1:13954">
        <div className="absolute contents left-0 top-0" data-node-id="I1:13954;509:17145">
          <div className="-translate-y-1/2 absolute h-[969px] left-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-1/2 w-[273px]" data-node-id="I1:13954;509:17146">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]">
              <div className="absolute bg-white inset-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]" />
              <img alt="" className="absolute max-w-none object-cover opacity-68 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] size-full" src={imgRectangle1} />
            </div>
          </div>
          <Link to="/patients" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[257px] whitespace-nowrap" data-node-id="I1:13954;509:17147">
            <p className="leading-[normal]">Patients</p>
          </Link>
          <Link to="/sales" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[577px] whitespace-nowrap" data-node-id="I1:13954;509:17148">
            <p className="leading-[normal]">Sales</p>
          </Link>
          <Link to="/activity-log" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[641px] whitespace-nowrap" data-node-id="I1:13954;509:17149">
            <p className="leading-[normal]">Activity Logs</p>
          </Link>
          <Link to="/treatments" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[448px] whitespace-nowrap" data-node-id="I1:13954;509:17150">
            <p className="leading-[normal]">Treatments</p>
          </Link>
          <Link to="/billing" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[705px] whitespace-nowrap" data-node-id="I1:13954;509:17151">
            <p className="leading-[normal]">Billing</p>
          </Link>
          <Link to="/medicines" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[513px] whitespace-nowrap" data-node-id="I1:13954;509:17152">
            <p className="leading-[normal]">Medicines</p>
          </Link>
          <Link to="/settings" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[769px] whitespace-nowrap" data-node-id="I1:13954;509:17153">
            <p className="leading-[normal]">Settings</p>
          </Link>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[81px] not-italic text-[#be880b] text-[12px] top-[120px] whitespace-nowrap" data-node-id="I1:13954;509:17154">
            A Journey of Healing
          </p>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-218.5px)]" data-node-id="I1:13954;509:17155" data-name="Person">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPerson} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+37.5px)]" data-node-id="I1:13954;509:17156" data-name="Briefcase Medical">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBriefcaseMedical} />
          </div>
          <Link to="/appointments" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[385px] whitespace-nowrap" data-node-id="I1:13954;509:17157">
            <p className="leading-[normal]">Appointments</p>
          </Link>
          <div className="-translate-x-1/2 absolute border-[#be880b] border-[0.813px] border-solid left-[calc(50%-1px)] rounded-[57.846px] size-[47px] top-[40px]" data-node-id="I1:13954;509:17158" data-name="logo (2) 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[57.846px]">
              <img alt="" className="absolute left-[-73.08%] max-w-none size-[242.31%] top-[-26.92%]" src={imgLogo21} />
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[46px] not-italic text-[#422c23] text-[16px] top-[97px] whitespace-nowrap" data-node-id="I1:13954;509:17159">
            GANESHA AYURVEDAA
          </p>
          <Link to="/dashboard" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[193px] whitespace-nowrap" data-node-id="I1:13954;509:17160">
            <p className="leading-[normal]">Dashboard</p>
          </Link>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-90.5px)]" data-node-id="I1:13954;509:17161" data-name="Calendar Person">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalendarPerson} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+293.5px)]" data-node-id="I1:13954;509:17162" data-name="Settings">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSettings} />
          </div>
          <div className="absolute bg-[#fffef7] h-[56px] left-[18px] rounded-bl-[10px] rounded-tl-[10px] top-[302px] w-[255px]" data-node-id="I1:13954;509:17163" />
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+165.5px)]" data-node-id="I1:13954;509:17164" data-name="History">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHistory} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+229.5px)]" data-node-id="I1:13954;509:17165" data-name="Document Bullet List">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDocumentBulletList} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+101.5px)]" data-node-id="I1:13954;509:17166" data-name="Data Histogram">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDataHistogram} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-26.5px)]" data-node-id="I1:13954;509:17167" data-name="Heart Pulse">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHeartPulse} />
          </div>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[74px] not-italic text-[#be880b] text-[16px] top-[321px] whitespace-nowrap" data-node-id="I1:13954;509:17168">
            Doctors
          </p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-282.5px)]" data-node-id="I1:13954;509:17169" data-name="Grid">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGrid} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-154.5px)]" data-node-id="I1:13954;509:17170" data-name="Doctor">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoctor} />
        </div>
      </div>
      <a className="absolute block cursor-pointer left-[1384px] size-[32px] top-[86px]" data-node-id="1:13955">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3704} />
      </a>
      <div className="absolute left-[1136px] size-[32px] top-[86px]" data-node-id="1:13956">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3705} />
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1368px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:13957">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1184px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:13958">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <Link to="/dashboard/profile-dropdown" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+624px)] size-[16px] top-[calc(50%-544.5px)]" data-node-id="1:13959" data-name="Chevron">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron} />
      </Link>
      <div className="absolute left-[1200px] size-[32px] top-[86px]" data-node-id="1:13960" data-name="Image">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="32" src={imgImage} width="32" />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#422c23] text-[13px] top-[86px] whitespace-nowrap" data-node-id="1:13961">
        Rahul Sharma
      </p>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#737373] text-[11px] top-[107px] whitespace-nowrap" data-node-id="1:13962">
        Super Admin
      </p>
      <Link to="/dashboard/logout-popup" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+680px)] size-[20px] top-[calc(50%-544.5px)]" data-node-id="1:13963" data-name="Arrow Exit">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowExit} />
      </Link>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+432px)] size-[20px] top-[calc(50%-544.5px)]" data-node-id="1:13964" data-name="Alert">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAlert} />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[1.5] left-[362px] not-italic text-[#be880b] text-[14px] top-[146px] whitespace-nowrap" data-node-id="1:13965">
        Patient Details
      </p>
      <div className="absolute bg-[#be880b] border-2 border-[#be880b] border-solid left-[321px] overflow-clip rounded-[50px] size-[30px] top-[142px]" data-node-id="1:13966">
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[1.5] left-[9px] not-italic text-[14px] text-white top-[2px] whitespace-nowrap" data-node-id="1:13967">
          1
        </p>
      </div>
      <Link to="/doctors/prescription/create" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[583px] not-italic text-[#422c23] text-[14px] top-[146px] whitespace-nowrap">
        <p className="leading-[1.5]">Create Prescription</p>
      </Link>
      <Link to="/doctors/prescription/create" className="absolute bg-white block border border-[#ede2ca] border-solid cursor-pointer left-[541px] overflow-clip rounded-[50px] size-[30px] top-[142px]">
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[1.5] left-[10px] not-italic text-[#67554d] text-[14px] text-left top-[3px] whitespace-nowrap" data-node-id="1:13970">
          2
        </p>
      </Link>
      <div className="absolute h-0 left-[486px] top-[156px] w-[40px]" data-node-id="1:13971">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine453} />
        </div>
      </div>
      <Link to="/appointments/create-patient" className="absolute contents cursor-pointer left-[939px] top-[86px]" data-name="Book Appointment">
        <div className="absolute inset-[6.65%_22.22%_90.87%_65.21%]" data-node-id="1:13973" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[24px] left-[977px] not-italic text-[14px] text-white top-[90px] whitespace-nowrap" data-node-id="1:13974">
          Book Appointment
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-[calc(50%+243px)] top-[calc(50%-543.5px)] w-[16px]" data-node-id="1:13975" data-name="Add">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAdd} />
        </div></Link>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[1032px] left-[321px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[196px] w-[1095px]" data-node-id="1:13976">
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[325px] w-[324px]" data-node-id="1:13977">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:13978">
            <p className="leading-[normal]">Consultation Type</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex gap-[12px] h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:13979">
            <div className="bg-white border border-[#e2e2e2] border-solid content-stretch flex gap-[7.071px] items-center justify-center py-[2.829px] relative rounded-[16.264px] shrink-0 w-[117px]" data-node-id="1:13980">
              <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[12.729px] text-black whitespace-nowrap" data-node-id="1:13981">
                Consultation
              </p>
              <div className="relative shrink-0 size-[12.729px]" data-node-id="1:13982" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
              </div>
            </div>
            <div className="bg-white border border-[#e2e2e2] border-solid content-stretch flex gap-[7.071px] items-center justify-center py-[2.829px] relative rounded-[16.264px] shrink-0 w-[99px]" data-node-id="1:13984">
              <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[12.729px] text-black whitespace-nowrap" data-node-id="1:13985">{`Therapy `}</p>
              <div className="relative shrink-0 size-[12.729px]" data-node-id="1:13986" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
              </div>
            </div>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:13988" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[690px] top-[325px] w-[389px]" data-node-id="1:13990">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:13991">
            <p className="leading-[normal]">Assigned Doctor</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:13992">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:13993">
              Assigned Doctor
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:13994" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[197px] w-[1063px]" data-node-id="1:13996">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:13997">
            Basic Information
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:13998" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[425px] w-[1063px]" data-node-id="1:14000">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:14001">
            Contact Information
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:14002" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[668px] w-[1063px]" data-node-id="1:14004">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:14005">
            Emergency Contact
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:14006" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[816px] w-[1063px]" data-node-id="1:14008">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:14009">{`Identification & Admin`}</p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:14010" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[245px] w-[324px]" data-node-id="1:14012">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14013">
            <p className="leading-[normal]">Full Name</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14014">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14015">
              Full Name
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[245px] w-[324px]" data-node-id="1:14016">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14017">
            <p className="leading-[normal]">Full Name</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14018">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14019">
              Full Name
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] h-[60px] items-start justify-center left-[358px] top-[245px] w-[161px]" data-node-id="1:14020">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:14021">
            <p className="leading-[normal]">Gender</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14022">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14023">
              Select Gender
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:14024" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[656px] top-[469px] w-[224px]" data-node-id="1:14026">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:14027">
            <p className="leading-[normal]">State</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14028">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14029">
              Select State
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:14030" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[897px] top-[469px] w-[182px]" data-node-id="1:14032">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:14033">
            <p className="leading-[normal]">City</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14034">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14035">
              Select City
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:14036" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[536px] top-[245px] w-[138px]" data-node-id="1:14038">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14039">
            <p className="leading-[normal]">Date of Birth</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14040">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14041">
              DOB
            </p>
            <div className="relative shrink-0 size-[18px]" data-node-id="1:14042" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[693px] top-[245px] w-[120px]" data-node-id="1:14046">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14047">
            <p className="leading-[normal]">Age</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14048">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14049">
              Age
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[830px] top-[245px] w-[249px]" data-node-id="1:14050">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:14051">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:14052">
              <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14053">
                <p className="leading-[normal]">Preferred Language</p>
              </div>
              <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14054">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14055">
                  Preferred Language
                </p>
                <div className="relative shrink-0 size-[20px]" data-node-id="1:14056" data-name="Frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[356px] top-[325px] w-[318px]" data-node-id="1:14058">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:14059">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:14060">
              <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14061">
                <p className="leading-[normal]">Registration Date</p>
              </div>
              <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14062">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14063">
                  Select Date
                </p>
                <div className="relative shrink-0 size-[18px]" data-node-id="1:14064" data-name="Frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[469px] w-[324px]" data-node-id="1:14068">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14069">
            <p className="leading-[normal]">Mobile Number</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14070">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14071">
              Mobile Number
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[358px] top-[469px] w-[280px]" data-node-id="1:14072">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14073">
            <p className="leading-[normal]">Email Address</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14074">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14075">
              Email Address
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[16px] top-[549px] w-[1063px]" data-node-id="1:14076">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:14077">
            <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:14078">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:14079">
                <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14080">
                  <p className="leading-[normal]">Permanent Address</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[55px] items-start px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14081">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14082">
                    Permanent Address
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[716px] w-[324px]" data-node-id="1:14083">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14084">
            <p className="leading-[normal]">Name</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14085">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14086">
              Name
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] h-[60px] items-start justify-center left-[358px] top-[716px] w-[316px]" data-node-id="1:14087">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:14088">
            <p className="leading-[normal]">Relation</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14089">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14090">
              Relation
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:14091" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[693px] top-[716px] w-[386px]" data-node-id="1:14093">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:14094">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:14095">
              <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14096">
                <p className="leading-[normal]">Phone Number</p>
              </div>
              <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14097">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14098">
                  Phone Number
                </p>
                <div className="relative shrink-0 size-[20px]" data-node-id="1:14099" data-name="Frame" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex gap-[16px] items-start left-[16px] top-[864px] w-[443px]" data-node-id="1:14100">
          <div className="content-stretch flex items-start relative shrink-0 w-[182px]" data-node-id="1:14101">
            <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:14102">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:14103">
                <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14104">
                  <p className="leading-[normal]">Patient ID</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14105">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14106">
                    Patient ID
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:14107">
            <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:14108">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:14109">
                <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14110">
                  <p className="leading-[normal]">ID Proof Typ</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14111">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14112">
                    ID Proof Typ
                  </p>
                  <div className="relative shrink-0 size-[20px]" data-node-id="1:14113" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[477px] top-[864px] w-[150px]" data-node-id="1:14115">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14116">
            <p className="leading-[normal]">ID No.</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14117">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14118">
              ID No.
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[646px] top-[864px] w-[143px]" data-node-id="1:14119">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14120">
            <p className="leading-[normal]">Occupation</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14121">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14122">
              Occupation
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:14123" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[808px] top-[864px] w-[271px]" data-node-id="1:14125">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:14126">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:14127">
              <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:14128">
                <p className="leading-[normal]">Insurance Details (Optional)</p>
              </div>
              <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:14129">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:14130">
                  Insurance Details (Optional)
                </p>
                <div className="relative shrink-0 size-[20px]" data-node-id="1:14131" data-name="Frame" />
              </div>
            </div>
          </div>
        </div>
        <Link to="/doctors/1" className="absolute bg-[#be880b] content-stretch cursor-pointer flex gap-[8px] h-[36px] items-center justify-center left-[807px] px-[6px] py-[8px] rounded-[8px] top-[972px] w-[270px] cursor-pointer" data-name="Button">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white text-left tracking-[0.56px] whitespace-nowrap" data-node-id="I1:14132;208:17867">
            <p className="leading-none">Next</p>
          </div>
        </Link>
        <Link to="/doctors/1" className="[word-break:break-word] absolute block font-['Inter'] font-semibold leading-[1.5] left-[16px] not-italic text-[#be880b] text-[14px] top-[126px] whitespace-nowrap">Personal Information</Link>
        <Link to="/doctors/1/medical-assessment" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[237px] not-italic text-[#422c23] text-[14px] top-[126px] whitespace-nowrap">Medical Assessment</Link>
        <Link to="/doctors/1/treatment" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[456px] not-italic text-[#422c23] text-[14px] top-[126px] whitespace-nowrap">{`Treatment & Follow Up`}</Link>
        <Link to="/doctors/1/billing" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[687px] not-italic text-[#422c23] text-[14px] top-[126px] whitespace-nowrap">{`Billing & Membership`}</Link>
        <div className="absolute h-0 left-[16px] top-[165px] w-[1063px]" data-node-id="1:14137">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine449} />
          </div>
        </div>
        <div className="absolute h-0 left-[16px] top-[165px] w-[141px]" data-node-id="1:14138">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine450} />
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[16px] rounded-[16px] top-[24px] w-[1063px]" data-node-id="1:14139">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="1:14140">
            <div className="content-stretch flex gap-[104px] items-center relative shrink-0 w-full" data-node-id="1:14141">
              <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-node-id="1:14142">
                <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-node-id="1:14143">
                  <p className="[word-break:break-word] font-[family-name:var(--typography\/family\/title,'Inter:Medium')] font-[var(--typography\/weight\/medium,500)] leading-[var(--typography\/height\/5,22px)] min-w-full not-italic relative shrink-0 text-[#737373] text-[length:var(--typography\/font-size\/14,14px)] w-[min-content]" data-node-id="1:14144">
                    Patient ID
                  </p>
                  <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0" data-node-id="1:14145">
                    <p className="[word-break:break-word] font-['Inter'] font-medium leading-[var(--typography\/height\/1,32px)] not-italic relative shrink-0 text-[#422c23] text-[24px] whitespace-nowrap" data-node-id="1:14146">
                      #37944397
                    </p>
                    <div className="bg-[#fff7e0] content-stretch flex h-[30px] items-center justify-center p-[6px] relative rounded-[16px] shrink-0 w-[119px]" data-node-id="1:14147">
                      <p className="[word-break:break-word] font-[family-name:var(--typography\/family\/title,'Inter:Medium')] font-[var(--typography\/weight\/medium,500)] leading-[var(--typography\/height\/6,20px)] not-italic relative shrink-0 text-[#be880b] text-[length:var(--typography\/font-size\/12,12px)] whitespace-nowrap" data-node-id="1:14148">
                        Under Treatment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col font-[family-name:var(--typography\/family\/title,'Inter:Medium')] font-[var(--typography\/weight\/medium,500)] gap-[4px] items-end justify-center not-italic relative shrink-0 text-right whitespace-nowrap" data-node-id="1:14149">
                <p className="leading-[var(--typography\/height\/5,22px)] relative shrink-0 text-[#737373] text-[length:var(--typography\/font-size\/14,14px)]" data-node-id="1:14150">
                  Dosha
                </p>
                <p className="leading-[var(--typography\/height\/3,26px)] relative shrink-0 text-[#be880b] text-[length:var(--typography\/font-size\/18,18px)]" data-node-id="1:14151">
                  Vata
                </p>
              </div>
            </div>
          </div>
          <div className="h-0 relative shrink-0 w-full" data-node-id="1:14152">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine155} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[8px] items-center left-[321px] top-[93px]" data-node-id="1:14153" data-name="Breadcrumb Group">
        <div className="content-stretch flex gap-[8px] items-end relative shrink-0" data-node-id="I1:14153;2704:192646" data-name="item 1">
          <Link to="/doctors" className="content-stretch cursor-pointer flex items-center px-px relative shrink-0" data-name="Link">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[18px] not-italic relative shrink-0 text-[#83899a] text-[14px] text-left tracking-[0.16px] whitespace-nowrap">Doctors</p>
          </Link>
          <p className="[word-break:break-word] font-['Inter'] leading-[18px] not-italic relative shrink-0 text-[#161616] text-[14px] tracking-[0.16px] whitespace-nowrap" data-node-id="I1:14153;2704:192646;70:24396">
            /
          </p>
        </div>
        <div className="content-stretch flex h-[18px] items-center pl-px relative shrink-0" data-node-id="I1:14153;2704:192648" data-name="item 4">
          <div className="content-stretch flex items-start relative shrink-0" data-node-id="I1:14153;2704:192648;484:22833" data-name="link">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[18px] not-italic relative shrink-0 text-[#422c23] text-[14px] tracking-[0.16px] whitespace-nowrap" data-node-id="I1:14153;2704:192648;0:12245">
              Patient Details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function DoctorPatientDetailsEditPage() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1293px] w-[1440px] shrink-0 overflow-visible">
        <DoctorPatientDetailsEditPageInner />
      </div>
    </div>
  );
}
