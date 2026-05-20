import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
    roc_curve
)


# ==========================================
# EVALUATE MODEL
# ==========================================

def evaluate_model(
    y_test,
    y_pred,
    y_prob
):
    """
    Calculate evaluation metrics.
    """

    metrics = {

        "accuracy":
            accuracy_score(y_test, y_pred),

        "precision":
            precision_score(y_test, y_pred),

        "recall":
            recall_score(y_test, y_pred),

        "f1":
            f1_score(y_test, y_pred),

        "roc_auc":
            roc_auc_score(y_test, y_prob)
    }

    return metrics


# ==========================================
# PRINT CLASSIFICATION REPORT
# ==========================================

def print_report(
    y_test,
    y_pred
):

    print("\nClassification Report\n")

    print(
        classification_report(
            y_test,
            y_pred
        )
    )


# ==========================================
# PLOT CONFUSION MATRIX
# ==========================================

def plot_confusion_matrix_chart(
    y_test,
    y_pred,
    province_name,
    lookback
):

    cm = confusion_matrix(
        y_test,
        y_pred
    )

    plt.figure(figsize=(6, 5))

    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues"
    )

    plt.title(
        f"Confusion Matrix\n"
        f"{province_name} | "
        f"Lookback={lookback}"
    )

    plt.xlabel("Predicted")
    plt.ylabel("Actual")

    plt.show()


# ==========================================
# PLOT ROC CURVE
# ==========================================

def plot_roc_curve_chart(
    y_test,
    y_prob,
    province_name,
    lookback
):

    fpr, tpr, _ = roc_curve(
        y_test,
        y_prob
    )

    auc_score = roc_auc_score(
        y_test,
        y_prob
    )

    plt.figure(figsize=(6, 5))

    plt.plot(
        fpr,
        tpr,
        label=f"AUC = {auc_score:.4f}"
    )

    plt.plot(
        [0, 1],
        [0, 1],
        linestyle="--"
    )

    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")

    plt.title(
        f"ROC Curve\n"
        f"{province_name} | "
        f"Lookback={lookback}"
    )

    plt.legend()

    plt.show()


# ==========================================
# CREATE RESULT ROW
# ==========================================

def create_result_row(
    province,
    lookback,
    forecast_horizon,
    metrics
):

    return {

        "province":
            province,

        "forecast_horizon":
            forecast_horizon,

        "lookback":
            lookback,

        "accuracy":
            metrics["accuracy"],

        "precision":
            metrics["precision"],

        "recall":
            metrics["recall"],

        "f1":
            metrics["f1"],

        "roc_auc":
            metrics["roc_auc"]
    }


# ==========================================
# CREATE RESULTS DATAFRAME
# ==========================================

def create_results_dataframe(
    results_list
):

    df = pd.DataFrame(results_list)

    return df


# ==========================================
# RANK MODELS
# ==========================================

def rank_models(
    results_df
):

    ranked_df = results_df.sort_values(
        by=[
            "f1",
            "roc_auc"
        ],
        ascending=False
    )

    ranked_df = ranked_df.reset_index(
        drop=True
    )

    return ranked_df


# ==========================================
# GET TOP MODELS
# ==========================================

def get_top_models(
    ranked_df,
    top_k=3
):

    return ranked_df.head(top_k)