import { H, M, Eq, Key, Note, Try, Bullets, Mx } from "./prose";

export default function Eigenvectors() {
  return (
    <>
      <p>
        Apply a matrix to a vector and two things usually change: its direction and its length. The direction change is
        the awkward one — it&apos;s what makes repeated application hard to reason about. So ask which vectors are
        spared it. Which directions does the map leave pointing exactly where they were?
      </p>
      <Eq note="λ is a number: the stretch factor along v">Av = λv</Eq>
      <p>
        A nonzero <M>v</M> satisfying this is an <strong>eigenvector</strong>, and its <M>λ</M> is the matching{" "}
        <strong>eigenvalue</strong>. Along such a direction the matrix stops being a warp and becomes a single number.
      </p>

      <H>Finding them without guessing</H>
      <p>
        Rewrite the equation with everything on one side. <M>Av = λv</M> becomes <M>(A − λI)v = 0</M>, and we need a{" "}
        <em>nonzero</em> <M>v</M> that this matrix sends to zero. A matrix with an inverse sends only the zero vector to
        zero, so such a <M>v</M> exists exactly when <M>A − λI</M> is <strong>not</strong> invertible — when it collapses
        the plane. And that is precisely when its determinant vanishes:
      </p>
      <Eq note="the characteristic equation">det(A − λI) = 0</Eq>
      <p>
        For a 2×2 this is a quadratic, and it&apos;s worth writing out because its coefficients are quantities you can
        read straight off the matrix:
      </p>
      <Eq note="tr A = a + d, det A = ad − bc">
        λ² − (tr A)·λ + det A = 0
      </Eq>
      <p>
        Solve for <M>λ</M>, then for each root go back and solve <M>(A − λI)v = 0</M> by elimination. Because the matrix
        is singular, that system has a whole line of solutions — as it must: if <M>v</M> is an eigenvector, so is every
        multiple of it. An eigen<em>vector</em> is really an eigen<em>direction</em>.
      </p>
      <Try>
        The derivation runs in steps along the top. The fan of pale arrows shows candidate directions and their images;
        the two that line up are the eigendirections. Swap in the presets to see each of the cases below.
      </Try>

      <H>What the discriminant is telling you</H>
      <p>
        A quadratic has three cases, and each is a genuinely different geometric situation rather than a technicality.
      </p>
      <Bullets>
        <li>
          <strong>Two real roots.</strong> Two independent eigendirections, each with its own stretch. The map is a
          stretch along one axis and a different stretch along another — not perpendicular axes in general, but axes.
        </li>
        <li>
          <strong>One repeated root.</strong> Either a single eigendirection, which makes the matrix a shear that can
          never be reduced to pure scaling, or — if <M>A − λI</M> is entirely zero — <em>every</em> direction is an
          eigendirection, and the matrix is just <M>λI</M>.
        </li>
        <li>
          <strong>No real roots.</strong> Every direction turns. A rotation is the honest example: nothing is left
          pointing where it started. The eigenvalues are complex, and their imaginary part encodes the angle of rotation
          — a hint that complex eigenvalues are how oscillation shows up in linear algebra.
        </li>
      </Bullets>
      <Note label="Two shortcuts">
        The eigenvalues of a triangular matrix are its diagonal entries, since subtracting <M>λ</M> makes a diagonal
        entry zero and a triangular determinant is the product of the diagonal. The matrix on the stage,{" "}
        <M><Mx rows={[["3", "1"], ["0", "2"]]} /></M>, therefore has <M>λ = 3</M> and <M>λ = 2</M> on sight. More
        generally, the roots sum to the trace and multiply to the determinant, which is usually enough to guess a 2×2&apos;s
        eigenvalues and confirm them in one line.
      </Note>

      <H>Why this is the payoff chapter</H>
      <p>
        Because eigenvectors turn repetition into arithmetic. If <M>Av = λv</M>, then <M>A²v = λ²v</M>, and{" "}
        <M>A¹⁰⁰⁰v = λ¹⁰⁰⁰v</M> — no matrix multiplication required. Write any starting vector in terms of the
        eigenvectors and applying <M>A</M> a thousand times becomes: scale each piece by its own <M>λ</M> to the
        thousandth power.
      </p>
      <p>
        Everything then depends on the sizes of the <M>λ</M>s. The largest one dominates and the rest fade, which is why
        this single idea underlies population models, the long-run state of a Markov chain, the stability of a
        differential equation, and the principal components of a data set. The next two chapters build that machinery
        properly.
      </p>

      <Key>
        <p>
          Eigenvectors are the directions a matrix doesn&apos;t rotate, and their eigenvalues are what it does along
          them. Find them and a complicated map becomes a few numbers, each acting on its own axis.
        </p>
      </Key>
    </>
  );
}
