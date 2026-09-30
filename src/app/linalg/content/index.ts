import SystemsOfEquations from "./systems-of-equations";
import EchelonForms from "./echelon-forms";
import SolutionSets from "./solution-sets";
import Parameters from "./parameters";
import Vectors from "./vectors";
import Span from "./span";
import MatrixEquation from "./matrix-equation";
import LinearIndependence from "./linear-independence";
import GaussianElimination from "./gaussian-elimination";
import LinearTransformations from "./linear-transformations";
import LU from "./lu";
import Eigenvectors from "./eigenvectors";
import DeterminantAsArea from "./determinant-as-area";
import DotProduct from "./dot-product";

/** Written chapter bodies, by slug. A chapter without one falls back to its status line. */
export const bodies: Record<string, React.ComponentType> = {
  "systems-of-equations": SystemsOfEquations,
  "echelon-forms": EchelonForms,
  "solution-sets": SolutionSets,
  parameters: Parameters,
  "vectors": Vectors,
  "span": Span,
  "matrix-equation": MatrixEquation,
  "linear-independence": LinearIndependence,
  "gaussian-elimination": GaussianElimination,
  "linear-transformations": LinearTransformations,
  lu: LU,
  eigenvectors: Eigenvectors,
  "determinant-as-area": DeterminantAsArea,
  "dot-product": DotProduct,
};
