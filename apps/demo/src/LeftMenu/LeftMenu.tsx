import { type FC } from "react";
import classNames from "classnames";
import {
  Checkbox,
  CheckboxWithInput,
  Container,
  RadioGroup,
  Section,
  StepperInput,
} from "../components";
import styles from "./LeftMenu.module.scss";

export type LeftMenuInputValue = string | number | boolean | null;

export type LeftMenuInputValues = {
  polygons: string;
  subjectFillType: string;
  clipFillType: string;
  clipTypeOperation: string;
  polygon: string;
  joinType: string;
  clean: number | null;
  simplify: boolean;
  lighten: number | null;
  autoFix: boolean;
  delta: number;
  miterLimit: number;
  scale: number;
  showSvgSource: boolean;
  showEnlargedSvg: boolean;
  bevel: boolean;
};

type LeftMenuProps = {
  className?: string;
  inputValues: LeftMenuInputValues;
  onChange: (value: LeftMenuInputValue, id: string) => void;
};

const polygonValues = [
  "arrows",
  "texts",
  "rects",
  "same",
  "randomRectangles",
  "random",
  "starAndRect",
  "spiral",
  "gridAndStar",
  "glyph",
  "custom",
];
const fillTypeValues = ["evenOdd", "nonZero"];
const clipTypeValues = ["none", "intersect", "union", "difference", "xor"];
const offsetPolygonValues = ["subject", "clip", "solution"];
const joinTypeValues = ["square", "round", "miter"];

const LeftMenu: FC<LeftMenuProps> = ({ className, inputValues, onChange }) => (
    <Container className={classNames(styles.root, className)}>
      <Section sectionId="polygons">
        <RadioGroup
          id="polygons"
          localePrefix="leftMenu"
          onChange={onChange}
          value={inputValues.polygons}
          values={polygonValues}
        />
      </Section>
      <Section sectionId="subjectFillType">
        <RadioGroup
          id="subjectFillType"
          localePrefix="leftMenu"
          onChange={onChange}
          value={inputValues.subjectFillType}
          values={fillTypeValues}
        />
      </Section>
      <Section sectionId="clipFillType">
        <RadioGroup
          id="clipFillType"
          localePrefix="leftMenu"
          onChange={onChange}
          value={inputValues.clipFillType}
          values={fillTypeValues}
        />
      </Section>
      <Section sectionId="clipTypeOperation">
        <RadioGroup
          id="clipTypeOperation"
          localePrefix="leftMenu"
          onChange={onChange}
          value={inputValues.clipTypeOperation}
          values={clipTypeValues}
        />
      </Section>
      <Section sectionId="cleaningAndSimplifying">
        <div className={styles.cleaningControls}>
          <CheckboxWithInput
            id="clean"
            localePrefix="leftMenu.cleaningAndSimplifying"
            value={inputValues.clean}
            onChange={onChange}
            defaultValue={0.1}
          />
          <Checkbox
            id="simplify"
            localePrefix="leftMenu.cleaningAndSimplifying"
            value={inputValues.simplify}
            onChange={onChange}
          />
          <CheckboxWithInput
            id="lighten"
            localePrefix="leftMenu.cleaningAndSimplifying"
            value={inputValues.lighten}
            onChange={onChange}
            defaultValue={0.1}
          />
        </div>
      </Section>
      <Section sectionId="offsetting" className={styles.offsettingGrid}>
        <StepperInput
          id="delta"
          localePrefix="leftMenu.offsetting"
          value={inputValues.delta}
          onChange={onChange}
        />
        <StepperInput
          id="miterLimit"
          localePrefix="leftMenu.offsetting"
          value={inputValues.miterLimit}
          onChange={onChange}
          step={0.1}
          min={1}
        />
        <Checkbox
          id="autoFix"
          localePrefix="leftMenu.offsetting"
          value={inputValues.autoFix}
          onChange={onChange}
        />
        <RadioGroup
          title
          className={styles.optionGroup}
          id="polygon"
          localePrefix="leftMenu.offsetting"
          onChange={onChange}
          value={inputValues.polygon}
          values={offsetPolygonValues}
        />
        <RadioGroup
          title
          className={styles.optionGroup}
          id="joinType"
          localePrefix="leftMenu.offsetting"
          onChange={onChange}
          value={inputValues.joinType}
          values={joinTypeValues}
        />
      </Section>
      <Section sectionId="scale">
        <div className={styles.scaleControl}>
          <StepperInput
            id="scale"
            localePrefix="leftMenu.scale"
            value={inputValues.scale}
            onChange={onChange}
            step={100}
            min={1}
          />
        </div>
      </Section>
      <Section sectionId="misc" className={styles.offsettingGrid}>
        <Checkbox
          id="showSvgSource"
          localePrefix="leftMenu.misc"
          value={inputValues.showSvgSource}
          onChange={onChange}
        />
        <Checkbox
          id="showEnlargedSvg"
          localePrefix="leftMenu.misc"
          value={inputValues.showEnlargedSvg}
          onChange={onChange}
        />
        <Checkbox
          id="bevel"
          localePrefix="leftMenu.misc"
          value={inputValues.bevel}
          onChange={onChange}
        />
      </Section>
    </Container>
);

export default LeftMenu;
