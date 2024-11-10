import * as tf from '@tensorflow/tfjs';

export class AviatorAI {
  private model: tf.LayersModel | null = null;

  async initialize() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 128, activation: 'relu', inputShape: [5] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
  }

  async train(data: number[][], crashPoints: number[]) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const xs = tf.tensor2d(data);
    const ys = tf.tensor1d(crashPoints);

    await this.model.fit(xs, ys, {
      epochs: 150,
      batchSize: 32,
      shuffle: true,
      validationSplit: 0.2
    });

    xs.dispose();
    ys.dispose();
  }

  async predict(input: number[]): Promise<number> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const prediction = await this.model.predict(tf.tensor2d([input])) as tf.Tensor;
    const result = await prediction.data();
    prediction.dispose();
    return result[0];
  }
}