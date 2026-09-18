import GaussianElimination from "./gaussian-elimination";
import LinearTransformations from "./linear-transformations";
import LU from "./lu";
import Eigenvectors from "./eigenvectors";
import DeterminantAsArea from "./determinant-as-area";
import DotProduct from "./dot-product";

/** Written chapter bodies, by slug. A chapter without one falls back to its status line. */
export const bodies: Record<string, React.ComponentType> = {
  "gaussian-elimination": GaussianElimination,
  "linear-transformations": LinearTransformations,
  lu: LU,
  eigenvectors: Eigenvectors,
  "determinant-as-area": DeterminantAsArea,
  "dot-product": DotProduct,
};
