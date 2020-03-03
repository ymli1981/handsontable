/* eslint-disable import/prefer-default-export */
/* eslint-disable jsdoc/require-description-complete-sentence */
import { arrayEach } from '../../../helpers/array';
import { HEADER_DEFAULT_SETTINGS } from './constants';
import { TRAVERSAL_BF } from '../../../utils/dataStructures/tree';

/**
 * A function that dump a tree structure into multidimensional array. That structure is
 * later processed by header renderers to modify TH elements to achive a proper
 * DOM structure.
 *
 * That structure contains settings object for every TH element generated by Walkontable.
 *
 * Output example:
 *   [
 *     [
 *       { label: 'A1', colspan: 2, origColspan: 2, hidden: false },
 *       { label: '', colspan: 1, origColspan: 1, hidden: true },
 *       { label: '', colspan: 1, origColspan: 1, hidden: false },
 *     ],
 *     [
 *       { label: 'true', colspan: 1, origColspan: 1, hidden: false },
 *       { label: 'B2', colspan: 1, origColspan: 1, hidden: false },
 *       { label: '4', colspan: 1, origColspan: 1, hidden: false },
 *     ],
 *     [
 *       { label: '', colspan: 1, origColspan: 1, hidden: false },
 *       { label: '', colspan: 1, origColspan: 1, hidden: false },
 *       { label: '', colspan: 1, origColspan: 1, hidden: false },
 *     ],
 *   ]
 *
 * @param {TreeNode[]} headerRoots An array of root nodes.
 * @returns {Array[]}
 */
export function colspanGenerator(headerRoots) {
  const colspanMatrix = [];

  arrayEach(headerRoots, (rootNode) => {
    rootNode.walk((node) => {
      const { data: { colspan, label, hidden, headerLevel } } = node;
      const colspanHeaderLayer = createNestedArrayIfNecessary(colspanMatrix, headerLevel);

      colspanHeaderLayer.push({
        origColspan: colspan,
        colspan,
        label,
        hidden,
      });

      if (colspan > 1) {
        for (let i = 0; i < colspan - 1; i++) {
          colspanHeaderLayer.push({
            ...HEADER_DEFAULT_SETTINGS,
            origColspan: colspan,
            hidden: true,
          });
        }
      }
    }, TRAVERSAL_BF);
  });

  return colspanMatrix;
}

/**
 * Internal helper which ensures that subarray exists under specified index.
 *
 * @param {Array[]} array An array to check.
 * @param {number} index An array index under the subarray should be checked.
 * @returns {Array}
 */
function createNestedArrayIfNecessary(array, index) {
  let subArray;

  if (Array.isArray(array[index])) {
    subArray = array[index];
  } else {
    subArray = [];
    array[index] = subArray;
  }

  return subArray;
}
