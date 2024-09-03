import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoExpanded from "src/assets/images/logos/logo_expanded.svg";
import LogoCollapsed from "src/assets/images/logos/logo_collapsed.svg";
import { styled } from "@mui/material";

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);

  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width:
      customizer.isCollapse && !customizer.isSidebarHover ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  return (
    <LinkStyled to="/">
      <img
        alt="logo"
        src={customizer.isCollapse ? LogoCollapsed : LogoExpanded}
        style={{ marginTop: "2rem" }}
      />
    </LinkStyled>
  );
};

export default Logo;
