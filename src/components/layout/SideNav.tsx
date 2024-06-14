import React from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import { useRouter } from "next/router";
import { BiSolidDashboard, BiSupport } from "react-icons/bi";
import { FaUserShield, FaWpforms, FaHome, FaAmazonPay } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { HiUsers } from "react-icons/hi";
import { BsFillCreditCardFill } from "react-icons/bs";
import {
  MdBusiness,
  MdCategory,
  MdEvent,
  MdInsertPhoto,
  MdOutlineEvent,
  MdOutlineVideoCameraBack,
  MdSecurity,
  MdSettings,
} from "react-icons/md";
import { useScreenSize } from "@/hooks";
import { SiReadthedocs } from "react-icons/si";
import Image from "next/image";
import { commonImages } from "@/assets";
import { AiOutlineClose } from "react-icons/ai";
import { IoDocument, IoDocumentTextOutline } from "react-icons/io5";
import { ImNewspaper } from "react-icons/im";
import { FaBriefcase } from "react-icons/fa6";

const SidebarNav: React.FC = () => {
  const router = useRouter();
  const { isMobile, isSm, isMd } = useScreenSize();

  const ITEMS = [
    {
      label: "Tableau de bord",
      href: "/",
      icon: <BiSolidDashboard size={25} />,
    },

    {
      label: "articles",
      href: "/articles",
      icon: <ImNewspaper size={25} />,
    },
    {
      label: "documents",
      href: "/documents",
      icon: <IoDocumentTextOutline size={25} />,
    },
    {
      label: "photos",
      href: "/photos",
      icon: <MdInsertPhoto size={25} />,
    },
    {
      label: "videos",
      href: "/videos",
      icon: <MdOutlineVideoCameraBack size={25} />,
    },
    {
      label: "événements",
      href: "/events",
      icon: <MdOutlineEvent />,
    },
    {
      label: "programmes de formation",
      href: "/training-programs",
      icon: <FaBriefcase size={25} />,
    },
    {
      label: "Catégories",
      href: "/categories",
      icon: <MdCategory size={25} />,
    },
    // {
    //   label: "utilisateurs",
    //   href: "/users",
    //   icon: <HiUsers size={25} />,
    // },
  ];

  const [toggled, setToggled] = React.useState(false);

  return (
    <div className="min-w-full min-h-full relative">
      <Sidebar
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#071D53",
            textTransform: "capitalize",
            // border: "thin solid black",
            // height: 'calc(100vh - 160px)',
            // minHeight: "100vh",
            // maxHeight: '100vh',
            height: "100vh",
            // maxWidth: '100%',
            // minWidth: '100%',
            display: "flex",
            position: "relative",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            // position: 'absolute',
            // bottom: 0,
            // left: 0,
            // paddingTop: !isMd ? "1rem" : "",
            paddingBottom: "1rem",
            marginRight: "-0.1rem", // cover outlier border right
            overflowY: "auto",
            // '&::-webkit-scrollbar': {
            //   width: '0px',
            //   background: 'transparent',
            // },
          },
        }}
        transitionDuration={500}
        // breakPoint="sm"
        // breakPoint="md"
        // customBreakPoint="639px"
        customBreakPoint="767px"
        // toggled={isMobile || isSm ? toggled : true}
        toggled={toggled}
        // collapsed={isSm || isMd ? true : false}
        collapsed={isMd ? true : false}
        onBackdropClick={() => setToggled(!toggled)}
      >
        {/* <button
          onClick={() => setToggled(false)}
          className="close-sidebar md:hidden z-50 absolute top-0 right-2 my-2 mx-1 text-white"
        >
          <AiOutlineClose size={30} />
        </button> */}
        <Menu
          rootStyles={{
            width: "100%",
            fontFamily: "Poppins",
            fontSize: "18px",
            border: "none",
            outline: "none",
          }}
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0) {
                return {
                  // color: disabled ? '#f5d9ff' : '#d359ff',
                  color: "white",
                  // opacity: active ? 1 : 0.7,
                  backgroundColor: active ? "#063777" : "inherit",
                  width: "95%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  border: "none",
                  outline: "none",
                  borderRadius: 8,
                  transition: "all 0.3s",
                  "&:hover": {
                    color: "white",
                    opacity: 1,
                    backgroundColor: "#063777",

                    outline: "none",
                  },
                };
              } else if (level === 1) {
                return {
                  // color: disabled ? '#f5d9ff' : '#d359ff',
                  color: active ? "#FC7702" : "white",
                  backgroundColor: "inherit",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  transition: "all 0.3s",
                  "&:hover": {
                    color: "#FC7702",
                    backgroundColor: "white",

                    outline: "none",
                  },
                };
              }
            },
          }}
        >
          {/* <SubMenu label="Charts">
            <MenuItem> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
          </SubMenu> */}

          {/* <div className="logo relative">
            <Image src={commonImages.logoLarge} alt="sursx logo" />
          </div> */}

          <div className="top bg-[#063777] flex items-stretch justify-start gap-4 h-[75px] p-2">
            <div className="logo rounded-lg center mb-4 h-[50px] w-[50px] overflow-hidden flex items-center justify-center">
              <div className="logo h-[70px] w-[100px] overflow-hidden relative bg-white p-0 rounded-lg">
                <Image
                  src={commonImages.logo}
                  alt="SursX Logo"
                  fill
                  // width={100}
                  // height={100}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-center max-h-full">
              <p className="text-white text-xl">CEAS-GRNE</p>
            </div>
          </div>

          <div className="w-full h-[calc(100vh-100px)] flex flex-col justify-between">
            <div className="menu py-4">
              {ITEMS.map((menu) => (
                <MenuItem
                  key={menu.label}
                  title={menu.label}
                  icon={menu.icon}
                  style={
                    router.pathname == menu.href
                      ? {
                          color: "#063777",
                          backgroundColor: "white",
                        }
                      : {}
                  }
                  onClick={() => router.push(menu.href)}
                >
                  {menu.label}
                </MenuItem>
              ))}
            </div>

            <div className="others">
              <MenuItem
                title={"Paramètres"}
                icon={<MdSettings />}
                style={
                  router.pathname.includes("/settings")
                    ? {
                        color: "#FC7702",
                        backgroundColor: "white",
                      }
                    : {}
                }
                onClick={() => router.push("/settings")}
              >
                {"Paramètres"}
              </MenuItem>
            </div>
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarNav;
