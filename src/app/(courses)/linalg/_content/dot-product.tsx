import { H, M, Eq, Key, Note, Try, Bullets } from "./prose";

export default function DotProduct() {
  return (
    <>
      <p>
        Everything so far has been done without measuring anything. We&apos;ve added vectors, combined them, and mapped
        them around, but never asked how <em>long</em> one is or what <em>angle</em> two of them make — those words
        aren&apos;t part of the vector space axioms. This unit adds them, and remarkably, one operation supplies both.
      </p>
      <Eq note="multiply matching components, then add">v · w = v₁w₁ + v₂w₂ + ⋯ + v<sub>n</sub>w<sub>n</sub></Eq>
      <p>
        The result is a single number, not a vector — hence the other name, <strong>scalar product</strong>. It looks
        like an arbitrary bit of arithmetic. It isn&apos;t.
      </p>

      <H>Length comes first</H>
      <p>
        Dot a vector with itself and every term becomes a square: <M>v · v = v₁² + v₂²</M>. That is Pythagoras, so
        the dot product already contains length:
      </p>
      <Eq note="the norm, or magnitude, of v">|v| = √(v · v)</Eq>
      <p>
        In <M>n</M> dimensions this is a definition rather than a theorem — there&apos;s no ruler out there to check it
        against — but it&apos;s the definition that makes the two-dimensional case come out right, which is the most any
        generalization can promise. Dividing a vector by its length gives a <strong>unit vector</strong>: same
        direction, length 1, useful whenever you want a direction without a size attached.
      </p>

      <H>Then angle</H>
      <p>
        The geometric fact, which the law of cosines proves in a few lines, is the one worth remembering:
      </p>
      <Eq note="algebra on the left, geometry on the right">v · w = |v| |w| cos θ</Eq>
      <p>
        The left side is cheap to compute from coordinates; the right side is what you actually want to know. Rearranged,
        it hands you the angle between any two vectors in any number of dimensions — a quantity you could not otherwise
        get at.
      </p>
      <p>Since the lengths are positive, the sign of the dot product is the sign of <M>cos θ</M>:</p>
      <Bullets>
        <li><strong>Positive</strong> — the angle is under 90°. The vectors broadly agree.</li>
        <li><strong>Zero</strong> — exactly 90°. They&apos;re <strong>orthogonal</strong>, and this is the definition that survives into higher dimensions.</li>
        <li><strong>Negative</strong> — over 90°. They point more apart than together.</li>
      </Bullets>
      <Try>
        Drag either arrow and watch the sign change as they swing past perpendicular. The preset marked{" "}
        <em>perpendicular</em> is the case worth dwelling on: the number is <M>0</M> even though neither vector is.
      </Try>
      <Note label="A test, not a coincidence">
        Orthogonality being a single equation — <M>v · w = 0</M> — is why the rest of this unit works. &ldquo;Find a
        vector perpendicular to these&rdquo; becomes a linear system, which we already know how to solve. Geometry
        turns into elimination.
      </Note>

      <H>Projection: the shadow of one vector on another</H>
      <p>
        Here is the dot product doing real work. Shine a light perpendicular to <M>v</M>&apos;s line and ask where{" "}
        <M>w</M>&apos;s shadow falls. The answer must be some multiple of <M>v</M>, say <M>kv</M>, and the defining
        property is that the leftover <M>w − kv</M> is perpendicular to <M>v</M>. Write that as a dot product and solve:
      </p>
      <Eq note="one equation, one unknown">
        (w − kv) · v = 0 → k = <span className="la-m">(w · v) / (v · v)</span>
      </Eq>
      <Eq>proj<sub>v</sub>w = <span className="la-m">(w · v) / (v · v)</span> · v</Eq>
      <p>
        Note what the pieces do. <M>w · v</M> measures how much of <M>w</M> lies along <M>v</M>; dividing by{" "}
        <M>v · v</M> corrects for <M>v</M>&apos;s own length, so the answer doesn&apos;t depend on how long you happened
        to draw <M>v</M>. If <M>v</M> is a unit vector the formula collapses to <M>(w · v)v</M> — which is why unit
        vectors are worth the trouble of normalizing.
      </p>
      <p>
        The projection is also the <em>closest point</em> to <M>w</M> on <M>v</M>&apos;s line: any other point adds a
        nonzero perpendicular leg, and the hypotenuse is longer. That innocuous observation is the whole idea behind
        least squares, three chapters from now — when <M>Ax = b</M> has no solution, project <M>b</M> onto the
        subspace that <M>A</M> can actually reach, and solve for that instead.
      </p>

      <H>The rules it obeys</H>
      <p>
        The dot product is symmetric, <M>v · w = w · v</M>, and linear in each argument, which is what lets you expand
        expressions like <M>(u + v) · w</M> term by term. Those two properties are all that&apos;s really needed, and
        an operation on any vector space satisfying them is called an <strong>inner product</strong> — there are
        useful ones on spaces of functions, where &ldquo;orthogonal&rdquo; ends up meaning what it does in a Fourier
        series. Same geometry, different vectors.
      </p>

      <Key>
        <p>
          The dot product converts algebra into geometry: <M>v · v</M> is length squared, its sign tells you which side
          of perpendicular two vectors are on, and <M>v · w = 0</M> is the one-line test for a right angle. Projection
          is its first payoff and the closest-point idea the whole unit rests on.
        </p>
      </Key>
    </>
  );
}
