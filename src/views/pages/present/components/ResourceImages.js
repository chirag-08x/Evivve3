import {
  Brick,
  Earth,
  Farms,
  Fish,
  Forest,
  Grains,
  Lake,
  Plain,
  Sheep,
  Wood,
} from "src/assets/images";
import styled from "@emotion/styled";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ResourcesContainer = styled("div")`
  display: flex;
  gap: 2.5rem;
`;
const ResourceImagesWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const ResourceAssetImg = styled("img")`
  width: 4rem;
`;

const ArrowWrapper = styled("div")`
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ResourceAssetName = styled("p")`
  color: #f5f5f5;
  font-size: 0.875rem;
  font-weight: 800;
  margin: 0;
  text-align: center;
`;

const ImgWrapper = styled("div")``;

const ResourceImages = () => {
  return (
    <ResourcesContainer>
      <ResourceImagesWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Lake} alt="" />
          <ResourceAssetName>Lake</ResourceAssetName>
        </ImgWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Fish} alt="" />
          <ResourceAssetName>Fish</ResourceAssetName>
        </ImgWrapper>
        <ArrowWrapper>
          <ArrowForwardIcon />
        </ArrowWrapper>
      </ResourceImagesWrapper>

      <ResourceImagesWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Forest} alt="" />
          <ResourceAssetName>Forest</ResourceAssetName>
        </ImgWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Wood} alt="" />
          <ResourceAssetName>Wood</ResourceAssetName>
        </ImgWrapper>
        <ArrowWrapper>
          <ArrowForwardIcon />
        </ArrowWrapper>
      </ResourceImagesWrapper>

      <ResourceImagesWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Plain} alt="" />
          <ResourceAssetName>Plain</ResourceAssetName>
        </ImgWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Sheep} alt="" />
          <ResourceAssetName>Sheep</ResourceAssetName>
        </ImgWrapper>
        <ArrowWrapper>
          <ArrowForwardIcon />
        </ArrowWrapper>
      </ResourceImagesWrapper>

      <ResourceImagesWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Earth} alt="" />
          <ResourceAssetName>Earth</ResourceAssetName>
        </ImgWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Brick} alt="" />
          <ResourceAssetName>Brick</ResourceAssetName>
        </ImgWrapper>
        <ArrowWrapper>
          <ArrowForwardIcon />
        </ArrowWrapper>
      </ResourceImagesWrapper>

      <ResourceImagesWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Farms} alt="" />
          <ResourceAssetName>Farms</ResourceAssetName>
        </ImgWrapper>
        <ImgWrapper>
          <ResourceAssetImg src={Grains} alt="" />
          <ResourceAssetName>Grains</ResourceAssetName>
        </ImgWrapper>
        <ArrowWrapper>
          <ArrowForwardIcon />
        </ArrowWrapper>
      </ResourceImagesWrapper>
    </ResourcesContainer>
  );
};

export default ResourceImages;
